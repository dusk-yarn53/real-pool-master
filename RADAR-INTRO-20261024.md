# Radar intro and rail clipping — local, not deployed

User reference: https://github.com/yanami-sec/codex-startup-animation-windows
The reference repository explicitly does not grant a new MIT or similar license.
This release uses independently written CSS and the existing arena artwork,
inspired by the radar / image reveal / shutter sequence; it does not copy the
reference JavaScript, images or Windows integration. The sequence is shortened
to the existing 3.6-second desktop / 2.8-second mobile intro duration.

Central copy: 欢迎回来，击打. No previous 欢迎回来创建 string was found
in this checkout. Skip, reduced motion, hidden-page exit and loader handoff remain.

Live balls now use the table-support clipping path throughout the table instead
of only near pockets, preventing rendered caps/trails from covering long rails.
Physics is unchanged. Pocket occlusion (six pockets), rim coverage (108 cases),
high-speed collision (12 cases), and intro lifecycle regressions passed.
Actual mobile visual acceptance and a browser preview of the new intro remain pending.

Files added: arena-intro.css and play/arena-intro.css. Include both on deployment.
