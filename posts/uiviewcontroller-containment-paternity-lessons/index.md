---
layout: postLayout.njk
postTitle: "UIViewController Containment — Paternity lessons"
date: "2016-03-22T18:18:34.989Z"
subtitle: "How to properly handle view controller containment in iOS (~ Swift 4.2)"
imageSrc: 1_y5-YI7kXrTAc_FouMLTohA.jpeg
imageAlt: "Parenting is tough but rewarding!"
author: Pedro Mancheno
tags: post
postTags:
  - iOS
  - Programming
  - Swift
  - Apple
  - Coding
---

In an effort to support more complex interfaces, Apple introduced the ability for developers to manage view controller containment in iOS 5. This allows apps to move away from the use of standard view controllers such as `UITabViewController`, `UINavigationController` and create more interesting and rich UI.

Still, the idea of managing several child view controllers seems daunting to developers and for a good reason. It’s just not a very straightforward concept, but really worth it if you want to keep your view controllers as lean as possible.

Adding a view controller as a child of another view controller involves several steps and failing to include any of these in the flow could mean potential bugs. It is important to handle containment in a responsible way!

Let us assume we have a `DadViewController` object that would like to add a `KidViewController` object as his child and present it in its interface.

`UIViewController` objects have a property named `children`, which is an array of view controllers that is maintained automatically.

The first step would be for `dad` to call the `add(kid:)` method passing `kid`. A reference to this instance will be added to the `children` array.

```swift
class DadViewController: UIViewController {
    func add(_ kid: KidViewController) {
        addChild(kid)
    }

    // ...
}
```

It’s important to understand that this action will trigger `kid`'s `viewDidLoad()` and `willMove(toParent:)` methods.

Next, we must manually add `kid`'s view as a subview of the `dad`'s own view hierarchy.

```swift
class DadViewController: UIViewController {
    func add(_ kid: KidViewController) {
        addChild(kid)
        view.addSubview(kid.view)
    }
    // ...
}
```

It is at this point that the `kid`'s `viewWillAppear()` and `viewDidAppear()` methods are triggered.

Finally, you are responsible for calling the `kid`'s `didMove(toParent:)` method manually, passing the instance of the parent view controller and also setting the correct frame for the its `view` property.

```swift
class DadViewController: UIViewController {
    func add(_ kid: KidViewController) {
        addChild(kid)
        view.addSubview(kid.view)
        kid.didMove(toParent: self)
        kid.view.frame = CGRect(x: 0, y: 100, width: 10, height: 10)
    }
    // ...
}
```

Removing a child view controller form a parent view controller follows a similar pattern:

```swift
class DadViewController: UIViewController {
    func remove(_ kid: KidViewController) {
        kid.willMove(toParent: nil)
        kid.view.removeFromSuperview()
        kid.removeFromParent()
    }
// ...
}
```

Simple!

```swift
let dad = DadViewController()
let kid = KidViewController()
dad.add(kid)
```

Remember that if you use Container Views in Storyboards, this is all handled automatically for you!
