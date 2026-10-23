# Near-table AI position refinement

User requested closer, finer cue-ball position, reviewed the offline preview, and explicitly authorized deployment. Release candidate: 20261024-close-position-v1.

- All difficulty levels now penalize long next-shot cue travel progressively beyond 22 and 40 table inches, with stronger cut-angle weighting. Very close/crowded contact positions and blocked continuations remain undesirable.
- Master no longer rewards extra stroke strength through a soft-stroke penalty. Search covers soft control and firmer draw/follow, followed by one-point power and 0.05 vertical-spin refinement.
- Master finalist scoring includes deterioration of the leave under the existing angle/power perturbations, in addition to pot and scratch robustness.
- Shared shot physics, legal target selection, and execution noise are unchanged. Root and play entries are synchronized.

Validation: new regression covers close/long, crowded/blocked leaves, and four deterministic full-planner positions. Cue-to-next-ball distance in old/new versions: 41.82/30.96, 32.40/32.40, 19.86/14.04, 19.35/18.72 inches. All new fixtures legally pot with 4/4 existing robustness probes. This is a small deterministic sample, not a general pot-rate guarantee. Some layouts still need longer leaves to preserve a viable next angle.

Existing master realism, master offence, aim continuity (192 frames/288 directions), and guide physics (18 guide + 6 pocket fixtures) regressions passed. Syntax, mirror equality and diff whitespace checks passed. CI includes the new position regression. No browser or phone playtest performed for this change.
