# Auscultation

**Sonification of Gemma Scope sparse autoencoder features — one forward pass becomes a score.**

Each token becomes a chord.  
Each note represents an active SAE feature.

**Live:** https://auscultation.keito.uk

> **Status:** experimental / work in progress  
> The interactive player exists. The Python capture pipeline is the next major step.

---

## The question

Machine-learning systems are mathematical objects, but most of the internal measurements we use to study them are visual: activation plots, feature dashboards, matrices, projections.

Auscultation asks a different question:

**Can sparse features extracted from Gemma's residual stream be mapped into sound while preserving enough structure for changes across tokens to become perceptible?**

This is not an attempt to reproduce an "inner voice."

It is a sonification experiment: taking one measurable representation of model activity and translating it into another sensory medium.

---

## Why "Auscultation"?

Auscultation is what a doctor does with a stethoscope: listening to an internal organ through an instrument.

The sound is not the organ itself.

It is an indirect, instrument-mediated measurement shaped by the properties of the instrument.

That is the intended framing here.

---

## Pipeline

```text
prompt
  ↓
Gemma-2-2b
  ↓
residual stream at layer 20
  ↓
Gemma Scope sparse autoencoder
  ↓
sparse feature activations per token
  ↓
decoder-space geometry + activation measurements
  ↓
musical mapping
  ↓
token-by-token score
  ↓
WebAudio playback
```

At each token position, the SAE produces a sparse activation pattern over its feature dictionary.

Auscultation turns that pattern into a chord.

---

## Mapping

| Model / SAE data | Musical representation |
|---|---|
| token position | time |
| feature identity | pitch |
| activation magnitude | velocity / note opacity |
| L0 / number of active features | chord-density signal |
| feature overlap between adjacent tokens | sustain / continuity |

The goal is not to make arbitrary generative music.

The goal is to make differences in the underlying sparse representation audible.

---

## The pitch problem

SAE feature IDs do not contain useful geometry.

Feature `12043` does not sit next to feature `12044` because the two are meaningfully related. The indices are identifiers, not coordinates.

Mapping raw feature ID directly to MIDI pitch would therefore impose an arbitrary ordering.

Auscultation instead uses the SAE decoder matrix.

Each feature has a decoder direction in residual-stream space:

```text
W_dec
```

Those decoder directions are projected onto the first principal component with PCA.

Features are then ranked by their coordinate along that axis and assigned pitch according to that ordering.

```text
decoder directions
      ↓
PCA
      ↓
PC1 coordinate
      ↓
rank
      ↓
pitch
```

This gives the otherwise arbitrary feature IDs a **geometry-informed one-dimensional ordering**.

Nearby pitches therefore represent features with similar positions **along the dominant PCA direction**.

That does **not** mean musical distance perfectly represents semantic distance.

PCA compresses a high-dimensional space into one dimension, so features that are close on PC1 may still differ substantially along dimensions that were discarded.

That loss is intentional — and measurable.

---

## Then I make it musical

The PCA-derived pitch ordering is still not automatically pleasant to listen to.

The resulting notes are therefore snapped to a musical scale.

This is another deliberate distortion.

There is nothing inherently:

- major
- minor
- consonant
- dissonant
- melodic

about an SAE feature.

Scale, root, tempo, timbre, and playback rules are interface decisions.

They trade representational fidelity for listenability.

A feature is not "in A minor."

---

## What you are not hearing

This matters more than anything else in the project.

**You are not hearing Gemma think.**

You are hearing one measurement of one part of one forward pass after several transformations.

### 1. The SAE is lossy

A sparse autoencoder reconstructs the residual stream imperfectly.

Its learned features are a model of structure within the activations — not a transparent readout of everything occurring inside Gemma.

### 2. One layer is only one slice

The current experiment measures the residual stream at layer 20.

Everything occurring elsewhere in the network is outside this particular sonification.

### 3. PCA destroys dimensions

The decoder directions live in a high-dimensional space.

Reducing them to one PCA coordinate necessarily removes information.

### 4. The musical mapping is invented

Pitch range, scale, tempo, timbre, velocity mapping, sustain behavior, and other musical choices are designed by me.

They are not properties discovered inside Gemma.

---

## What survives the translation?

Despite those losses, the score still encodes measured variation from the SAE.

Across tokens, the system preserves information about:

- which SAE features are active
- how strongly they activate
- how many features are active
- how activation patterns change from token to token
- how much successive token representations overlap
- where active feature decoder directions fall along the selected PCA axis

Those quantities come from the model/SAE pipeline.

The musical representation is the interface placed on top of them.

---

## L0 is not uncertainty

L0 measures sparsity: roughly, how many SAE features are active for a token.

In Auscultation, variation in L0 contributes to the perceived density of the score.

A token associated with more active features can therefore produce a denser representation than one associated with fewer active features.

That does **not** by itself mean:

> more features = more uncertainty

or:

> fewer features = greater certainty

Whether SAE sparsity systematically relates to next-token uncertainty is an empirical question.

A future experiment could compare token-level L0 against measures such as next-token entropy and test whether a relationship actually exists.

Until then, Auscultation treats L0 as what it directly measures:

**sparse feature activity.**

---

## Why use sound?

Sonification does not replace visualization or quantitative analysis.

It adds another representation.

Human hearing is unusually sensitive to:

- temporal repetition
- rhythm
- density
- abrupt transitions
- sustained structure
- recurrence
- changes in texture

Auscultation explores whether those perceptual abilities can make patterns in sparse feature activity noticeable in a different way.

If something sounds interesting, that is not the conclusion.

It is a reason to inspect the underlying data.

---

## Current interface

The browser-side player currently supports:

- token-by-token roll visualization
- WebAudio playback
- transport controls
- playback-rate controls
- musical scale controls
- token/chord visualization

The current demo score is hand-built so the interface can be developed independently of the model-capture pipeline.

It lives at:

```text
src/data/demoScore.ts
```

The displayed data should therefore **not** currently be interpreted as a captured Gemma forward pass.

---

## Data model

The score format is defined in:

```text
src/types.ts
```

A `Score` contains configuration information describing the capture and playback setup, including values such as:

- model
- layer
- SAE width
- top-k
- musical scale
- root
- tokens per second

Each token is represented by a `TokenChord`.

A token chord can include:

- token text
- L0
- overlap with the previous token
- active feature notes

Each `FeatureNote` can contain:

- `featureId`
- `midi`
- `velocity`
- optional auto-interp label

Most SAE features do not have clean human-readable labels.

That is not missing UI metadata.

It reflects the current state of interpretability.

---

## Stack

### Interface

- React
- TypeScript
- Vite
- WebAudio
- Cloudflare Workers

Audio playback is hand-built with WebAudio rather than Tone.js.

### Capture pipeline — next stage

The Python side will perform the actual model instrumentation and score extraction.

Planned components include:

- Gemma-2-2b
- Gemma Scope SAE weights
- TransformerLens
- Python
- PCA over SAE decoder directions

The resulting capture will be exported into the `Score` format consumed by the web interface.

---

## Planned capture flow

```text
prompt
  ↓
run Gemma
  ↓
hook residual stream
  ↓
apply Gemma Scope SAE
  ↓
collect feature activations per token
  ↓
measure L0 + inter-token overlap
  ↓
project W_dec with PCA
  ↓
assign feature pitches
  ↓
construct Score JSON
  ↓
load into Auscultation
```

---

## Evaluation

Because sonification introduces arbitrary design choices, the project should not be evaluated only by whether the result sounds interesting.

Useful comparisons include:

### Geometry

Compare:

```text
PCA pitch ordering
vs.
raw feature-index ordering
vs.
random pitch ordering
```

If the PCA mapping preserves useful structure, those representations should not behave identically.

### Layers

Repeat the same prompt across different residual-stream layers.

### Prompts

Compare related and contrasting prompts while holding the mapping configuration fixed.

### Sparsity

Inspect how L0 and rendered chord density change across tokens.

### Uncertainty

Separately calculate next-token entropy and test whether it has any relationship with SAE L0.

Do not assume the relationship in advance.

### Reproducibility

The same captured activations and mapping configuration should produce the same score.

---

## Current status

### Working

- interface
- piano-roll style visualization
- WebAudio playback
- transport
- scale controls
- playback-rate controls
- score data structure

### Next

- real Python capture pipeline
- Gemma Scope SAE integration
- PCA-derived feature-to-pitch map
- feature inspector
- Neuronpedia links
- saved-score shelf
- listening notes
- WAV export
- inter-token overlap visualization / slit-scan smear
- evaluation against alternative pitch mappings

---

## Design principle

Auscultation should make its transformations visible rather than pretending they do not exist.

The chain is:

```text
model
→ measurement
→ sparse representation
→ dimensionality reduction
→ mapping
→ sound
→ human perception
```

Every arrow changes something.

The interesting question is not whether the final sound *is* Gemma.

It isn't.

The question is:

**what structure survives all the way through?**

---

## Credits

Gemma Scope sparse autoencoders — Google DeepMind.

Feature labels, where available, may use Neuronpedia auto-interpretations.

Built by **@geminigooner — Studio Keito**.