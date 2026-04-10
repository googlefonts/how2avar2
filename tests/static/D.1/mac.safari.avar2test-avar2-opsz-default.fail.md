Safari has known bugs in their Optical Size `opsz` implementations.  Selecting axis values that are not the default (e.g. `"wght" 401, "wdth" 101, "opsz" 17`) gives a much closer result than the default values (e.g. `"wght" 400, "wdth" 100, "opsz" 16`).

Discussions include:
- https://forum.glyphsapp.com/t/variable-font-display-issue-in-mobile-safari/23770
- https://forum.glyphsapp.com/t/variable-optical-size-doesnt-work/27243/5
- https://clagnut.com/blog/2423
- https://bugs.webkit.org/show_bug.cgi?id=227353
