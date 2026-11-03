---
layout: postLayout.njk
postTitle: "Canonical request logs in Flask"
date: "2026-01-09T10:42:00.000Z"
author: Luke Hansford
tags: post
postTags:
  - Programming
  - Coding
  - Logging
  - Observability
  - Flask
  - Python
---

This is a short guide on how we added [canonical request logs](https://baselime.io/blog/canonical-log-lines) to a [Flask](https://flask.palletsprojects.com/en/stable/) service we have running at [Fishbrain](https://fishbrain.com). A few caveats before we get into it:

- I work with Python very infrequently, so the solution described here might not be optimal.
- We employ uWSGI as a proxy for this service, so that somewhat shaped the solution for us.
- The logs are being ingested by Datadog, which also informed our solution.

## Configuration

```python
import logging

import structlog
from structlog.contextvars import bind_contextvars, clear_contextvars, merge_contextvars

logging.basicConfig(
    format="%(message)s",
    stream=sys.stdout,
    level=logging.INFO,
)

structlog.configure(
    processors=[
        merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.CallsiteParameterAdder(
            {
                structlog.processors.CallsiteParameter.FILENAME,
                structlog.processors.CallsiteParameter.FUNC_NAME,
                structlog.processors.CallsiteParameter.LINENO,
            }
        ),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)
log = structlog.get_logger()
```

For our service we've gone with using the [structlog library](https://www.structlog.org/en/stable/) to build around. Our setup is a little verbose, but provides us with a nice set of fundamentals for our logs. The most notable inclusion here is `structlog.processors.JSONRenderer` which outputs our log as JSON (the preferred format for Datadog which will ingest the logs).

## Starting a new request

```python
@APP.before_request
def prepare_request_log():
    clear_contextvars()
    g.start = time.time_ns()
```

When a new request starts we do two things. First is to call `clear_contextvars()` to remove any pre-existing values for the log (this shouldn't be an issue, but is good hygiene). Second is to set a marker for the time the request started, as we'll be adding the duration of the request to our log later on.

To do this we're utilising Flask's `before_request` handler, to make sure we do this before each request.

## Appending data to the log

```python
log_attributes = {
	"args.latitude": request.args.get("lat", type=float),
	"args.longitude": request.args.get("lng", type=float),
	"args.species_ids": request.args.get("species_ids"),
}
bind_contextvars(**log_attributes)
```

The goal with canonical request logs is to be able to append data to the log as the request proceeds. For example above we take the arguments of the request and use `bind_contextvars` to append them to the log. We've used a period in the key to denote nesting, which we process later on in Datadog to produce the following:

```json
{
	"args": {
		"latitude": 0,
		"longitude": 0,
		"species_ids": "1,2,3"
	},
	"someOtherLogAttribute": "..."
}
```

One core element of `bind_contextvars` is that it will apply to all logs we output during the request. So if we need to log an error message during the request, as well as the final request log, those bound attributes will be included in both logs.

## Finalising the request log

```python
@APP.after_request
def log_request(response):
    log_attributes = {
        "http.method": request.method,
        "http.url": request.url,
        "http.status_code": response.status_code,
        "duration": time.time_ns() - g.start,
    }
    bind_contextvars(**log_attributes)
    if response.status_code >= 400:
        log.error("Request failed", error_message=response.get_json()["message"])
    else:
        log.info("Request complete")

    return response
```

Once the request is done we can append attributes relating to the outcome of the request. We use Flask's `after_request` handler to get the response and append the status code, duration, and other metadata to the log.

Finally we call `log.error`/`log.info` with a simple message. The message and attributes we've previously bound to the logger will be rolled into a single JSON object that we output to a destination of choice like so:

```json
{
  "message": "Request failed",
  "error_message": "Unknown error from SomeThirdPartyService",
  "level": "error",
  "source": "stderr",
  "args.latitude": 1.23,
  "args.species_ids": "1,2,3,4,5",
  "args.longitude": -98.76,
  "filename": "application.py",
  "lineno": 116,
  "http.status_code": 502,
  "http.method": "GET",
  "http.url": "http://someurl.com/fishing_forecast?species_ids=1,2,3,4,5&lat=1.23&lng=-98.76&hours_ahead=168&hours_behind=2",
  "timestamp": "2026-01-04T19:47:25.017696Z",
  "func_name": "log_request",
  "duration": 1234.5678,
  "logger": "app.application"
}
```

*Originally published at [https://lukehansford.me/posts/canonical-request-logs-in-flask](https://lukehansford.me/posts/canonical-request-logs-in-flask)*
