import {Body, Controller, Inject, Post} from '@nestjs/common';

import {TtsService} from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(@Inject(TtsService) private readonly ttsService: TtsService) {}

  @Post('preview')
  preview(@Body() body: unknown) {
    return this.ttsService.preview(body);
  }
}
