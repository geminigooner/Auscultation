# Auscultation

Sonification of sparse autoencoder features in Gemma-2-2b. One forward pass becomes a score: each token is a chord, each note is a feature that fired.

**Live:** [auscultation.keito.uk](https://auscultation.keito.uk)

---

## What this is

*Auscultation* is what a doctor does with a stethoscope — listening to an internal organ through the body wall. Instrument-mediated, diagnostic, and lossy. That's the honest framing for this project.

A prompt runs through Gemma-2-2b. The residual stream at layer 20 is decomposed by a Gemma Scope sparse autoencoder into a sparse set of interpretable features. At each token position, some small number of the SAE's 16,384 features are active. Those become a chord.

| data | musical parameter |
|---|---|
| token position | time |
| feature identity | pitch |
| activation magnitude | velocity / note opacity |
| L0 (how many features fired) | chord density |
| feature overlap between adjacent tokens | how much the chord is held over |

## The pitch problem

Feature indices are arbitrary. Feature 12043 sits next to 12044 for no reason — the SAE learned them in whatever order training happened to produce. Mapping index directly to pitch would produce noise wearing the costume of music.

So pitch comes from the decoder instead. Each feature has a direction in residual-stream space (`W_dec`). Project those directions to one dimension with PCA, rank them, and assign pitch by rank. Features that are semantically neighboring end up as neighboring pitches. A chord's *shape* then carries real information: a tight cluster means the active features point in similar directions; a wide spread means the token is doing several unrelated things at once.

The resulting pitches are then snapped to a scale. This is a lie, and an intentional one — see below.

## What you are not hearing

This matters more than anything else here, so it goes above the install instructions.

**You are not hearing Gemma think.** You are hearing one measurement of one layer, translated three times:

1. **The SAE is lossy.** It reconstructs the residual stream imperfectly. Features are a hypothesis about what the model is doing, not a readout of it.
2. **Layer 20 is one slice.** A forward pass is 26 layers wide and everything before and after this one is discarded.
3. **The musical mapping is invented.** Pitch order, scale, root, tempo, timbre — I chose all of it. Snapping to a minor scale in particular destroys information in exchange for listenability. Nothing about a sparse feature is "in A minor."

What survives all three steps is real, though, and it's worth naming: **the rhythm of the model's certainty.** L0 rises where the next token is ambiguous and falls where context has constrained it. That narrowing is audible, and it isn't something I put there.

## Stack

- React + TypeScript + Vite, deployed on Cloudflare Workers
- WebAudio, hand-rolled — no Tone.js
- Python side (not yet in this repo): `transformer_lens` + Gemma Scope SAE weights, exports a `Score` JSON

## Data model

Everything conforms to `src/types.ts`. A `Score` holds `ScoreConfig` (model, layer, SAE width, top-k, scale, root, tokens/sec) and an array of `TokenChord`. Each `TokenChord` has the token text, its `l0`, its `overlap` with the previous token, and up to `topK` `FeatureNote`s — each a `featureId`, a `midi`, a `velocity`, and an optional auto-interp `label`.

Most features have no label. That is not a gap in the data; it is the current state of interpretability.

## Running it

    npm install
    npm run dev

`src/data/demoScore.ts` is a hand-built score used for developing the player without touching the Python side.

## Status

Working: the roll, playback, transport, scale and rate controls.

Next: feature inspector with Neuronpedia links, the shelf (saved scores with listening notes), WAV export, the real capture pipeline, and a slit-scan smear on the roll driven by inter-token feature overlap.

## Credits

Gemma Scope SAEs by Google DeepMind. Feature labels, where present, come from Neuronpedia's auto-interp.

Built by [@geminigooner](https://github.com/geminigooner) — Studio Keito.
