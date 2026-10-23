# Near position and stable aim guide — 2026-10-24

Implemented on `fix/near-position-stable-guide-20261024`; not deployed.

## Behavior

- Master filters out distant leaves whenever simulation finds a legal pot with a playable close continuation. Close means both cue-to-object centre distance and cue-to-ghost contact distance <=22 inches, clear approach and pot paths, approach cosine >=.55, at least5 inches approach clearance, and cue not frozen to cushion. Winning shots need no continuation. Impossible near positions retain a legal available attack; no ball relocation or altered AI-only physics.
- High-energy search explores powers50–100, strong draw/follow/side and combined spin, with local refinement of multiple-cushion routes and diverse aim adjustments. Finalists are tested under angle/power perturbations; stable close leaves are preferred within the hard near set. Execution still has natural input error, so this is not a guarantee for every possible shot.
- Cushion tangential friction now acts continuously across zero spin and the former absolute-spin .5 threshold. Energy remains bounded. Existing cushion-kick test angles were recalibrated using the live solver because neutral oblique rebound angles changed.
- Immediate aim prediction reuses a cached cloth-evolved approach instead of applying launch spin at contact. Outgoing paths use the same collision/cloth laws as live balls; idle refinement blends over100ms. Dragging gets current input immediately. Buffered canvas presentation and a thicker thin stroke reduce presentation artifacts. Guidance still stops at the first cushion.

## Validation

- Four deterministic AI fixtures legally potted with next-ball centre distances11.997,10.485,11.878,17.118 inches (~27–44cm), robustness1. One strong-follow fixture used97% power and two actual cue cushions, ending11.997 inches from a clear next shot; near robustness>=.75.
- New tests verify near hard gating against an arbitrarily better far score, blocked/crowded rejection, actual two-cushion close leave, continuous cushion response and bounded energy, long-approach spin decay, timed guide refinement.
- 192 drag frames and288 direction samples passed; native canvas36 visible line samples passed.48 mocked drag frames:39.69ms total CPU, zero full-world physics steps and zero full UI updates. This is not phone FPS.
- Existing master offence/realism, high-speed contact, aim scheduling/quality, touch controls, and guide physics regressions exercised separately. See test outputs for final status.
- No iPhone or Android physical device acceptance in this revision. Model remains simplified2D dynamics with rendered depth, not a calibrated3D rigid-body solver.

## Continuity

Previous local checkpoint was removed by workspace maintenance. This revision was reconstructed from conversation records against remote main f64e6eb. Keep the feature branch or recovery patch durable before pausing. Do not merge or deploy without a user request.
