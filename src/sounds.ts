import { Howl } from 'howler';

export const sfx = {
  click:      new Howl({ src: ['/sounds/click.wav'],       volume: 0.6 }),
  whoosh:     new Howl({ src: ['/sounds/whoosh.wav'],      volume: 0.5 }),
  pop:        new Howl({ src: ['/sounds/pop.wav'],         volume: 0.7 }),
  logo_click:    new Howl({ src: ['/sounds/logo_click.wav'],    volume: 1.0 }),
  char_click:    new Howl({ src: ['/sounds/char_click.wav'],    volume: 1.0 }),
  daisy_modna:   new Howl({ src: ['/sounds/daisy_modna.wav'],   volume: 1.0 }),
  daisy_board:   new Howl({ src: ['/sounds/daisy_board.wav'],   volume: 1.0 }),
  candy_reading: new Howl({ src: ['/sounds/candy_reading.wav'], volume: 1.0 }),
  chinese:    new Howl({ src: ['/sounds/chinese_music.mp3'], volume: 0.45, loop: true }),
};
