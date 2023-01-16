import { GetDaysPipe } from './shared/pipes/get-day.pipe';

describe('GetDaysPipe', () => {
  it('create an instance', () => {
    const pipe = new GetDaysPipe();
    expect(pipe).toBeTruthy();
  });
});
