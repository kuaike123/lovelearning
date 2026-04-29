# TTS Provider Setup

The TTS layer is provider-based. The job pipeline should continue calling `synthesizeSceneAudio`; provider selection stays inside `packages/tts-service`.

## Current providers

- `mock`: returns a mock URL and does not write files.
- `placeholder`: writes a playable WAV placeholder and estimates duration from narration text.
- `windows_sapi`: uses Windows System.Speech when available, then falls back to `placeholder`.
- `commercial_stub`: reserved extension point for mainland commercial TTS providers.

## Environment switches

Use `EDU_TTS_PROVIDER` for provider selection:

```bash
EDU_TTS_PROVIDER=windows_sapi
```

Accepted values:

- `mock`
- `placeholder`
- `windows_sapi`

Legacy `EDU_TTS_MODE=mock | placeholder_wav | windows_sapi` still works.

## Next commercial provider shape

Add a provider in `packages/tts-service/src/tts-provider.ts` that implements:

```ts
type TtsProvider = {
  id: TtsProviderId;
  synthesize: (input: TtsProviderInput) => Promise<AudioMeta>;
};
```

The provider should write or return an audio file URL, report `durationSec`, and keep the job runner unchanged.
