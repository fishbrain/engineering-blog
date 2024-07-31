---
layout: postLayout.njk
postTitle: "Key Takeaways from the CrowdStrike Outage"
date: "2024-07-31T16:00:00.625Z"
subtitle: "What the CrowdStrike Outage Taught Us About Software Stability"
imageSrc: crowdstrike-outage.webp
imageAlt: CrowdStrike Outage
author: Gayan Witharana
tags: post
postTags:
  - Web Development
  - version management  
  - crowdStrike outage
  - package management
  - DevOps
---

## Insights on the CrowdStrike Update
On 18th of July 2024, CrowdStrike, a leading cybersecurity company known for its antivirus tools, released a software update that had significant repercussions on IT systems globally. This update particularly impacted the Microsoft ecosystem, causing widespread disruptions. Detailed information about this update can be found in CrowdStrike's official communication [here](https://www.crowdstrike.com/blog/to-our-customers-and-partners).

## Risks of Adopting the Latest Versions
Typically, large companies avoid using the latest versions of applications immediately upon release. However, in this case, CrowdStrike not only updated to the latest version but also distributed this update as a patch across all other versions. Unfortunately, this update contained a bug that was not detected by their testing frameworks, leading to its integration into the applications. This incident highlights the risks associated with adopting the latest software versions without adequate validation.

## Importance of Using Stable Versions
One of the key learnings from this outage is the importance of using older, stable versions for critical projects. Relying on the latest software versions can be risky, as they are more likely to contain undiscovered bugs that can cause significant damage to applications and harm a company's reputation. When using third-party libraries, it is prudent to stick with older, stable versions until they have been thoroughly tested and proven reliable. This cautious approach allows any bugs introduced in updates to be identified and resolved before they impact your systems.

## Best Practices for Package Management
When using a package manager for developing web applications, it is important to use a lock file and manage third-party library versions intentionally. For example, with the Yarn package manager:

* If `package.json` specifies `"example-package": "^1.2.3"` and the `yarn.lock` file lists `example-package@1.2.3`, Yarn will always install `1.2.3` as long as the `yarn.lock` file is used.
#### If you run **yarn upgrade example-package**:
  * With `"example-package": "^1.2.3"`, Yarn might update to `1.9.9` if available.
  * With `"example-package": "~1.2.3"`, Yarn would only update to `1.2.9` if available, but not `1.3.0`.

As you can see, using the caret (^) is a bit riskier, and even using the tilde (~) can be risky if a patch update contains a significant bug, although this is less likely. Being cautious with version management helps mitigate potential risks and ensures greater stability in your applications.

## Lessons from the Left-Pad Incident
Also, on March 22, 2016, there was a similar incident with the "left-pad" module in npm. Since the author removed the "left-pad" package, a lot of outages occurred because thousands of major libraries used this "left-pad" library, which is just 11 lines of code. You can read the whole story of the "left-pad" incident in this [wiki page](https://en.wikipedia.org/wiki/Npm_left-pad_incident).

Therefore, we should always try not to use third-party libraries every time we face a complex problem. When we do use these libraries, we need to do it intentionally, keep an eye on the versions, and try to use an older stable version rather than the latest version.


### References

- [Crowdstrike](https://www.crowdstrike.com/blog/to-our-customers-and-partners)
- [left-pad incident](https://en.wikipedia.org/wiki/Npm_left-pad_incident)
- [Youtube video](https://www.youtube.com/watch?v=w9CzkaT6xcI&pp=ygUed2ViIGRldiBzaW1wbGlmaWVkIGNyb3dkc3RyaWtl)
