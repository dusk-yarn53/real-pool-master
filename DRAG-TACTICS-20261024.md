# Drag and master tactics update — not deployed

Base: ad429c7, production release 20261024-near-multirail-v2.

- Cloth drag gain is a constant 0.025 degrees per CSS pixel (previously 0.006 with quadratic acceleration beyond 100 pixels). Fine ruler remains 0.002.
- Active drag paints on every native requestAnimationFrame callback, with no timer or frame skip. Unchanged preview geometry is cached. Aim painting no longer triggers resolution changes that clear/rebuild the canvas. Releasing stops the active aim loop.
- Master searches banks alongside available direct pots and reserves a bank seed for position refinement. Expanded high-power position search includes all four diverse route seeds.
- Cluster opening score requires a safe pot, a clear close continuation, separation of surviving nearby balls by at least 3 inches, and an available pocket lane. Eight-ball opponent-only clusters receive no bonus. These strokes join the fine position search. No modified collision/launch rules.
- Existing 22-inch close-position gate and input-perturbation checks remain.

Validation: native-refresh scheduling at 60/90/120 Hz (270 callbacks), linear reversal, no mid-drag buffer resize; raster guide visibility; input direction/quality/scheduling/continuity; master offence/realism; close-position and multi-rail; cushion guide refinement. Controlled zero execution-error K-ball fixture legally pots, spreads a pair and finishes 14.740 inches from the next playable ball. This complex K-ball fixture remains sensitive to execution noise; it is not evidence of guaranteed cluster-opening success. No phone-device FPS or touch-feel acceptance yet.

This change is local only. Refresh index/startup asset versions and deploy only when explicitly requested.
