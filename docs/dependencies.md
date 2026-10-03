# Dependencies

The shipped runtime has no third-party libraries or remote fonts. Browser APIs and ES modules cover the small state and dialog flows. This removes installation and version drift from the user's first experiment; adding a framework is justified only by a new capability.

Development checks use Node built-ins. PNG icons were generated once with Pillow from the exact geometric brand mark; regeneration is unnecessary unless the brand changes. Pillow is not needed to serve or test the app.

Review when a runtime dependency or icon pipeline changes. See [decision](decisions.md) and [stack](stack.md).
