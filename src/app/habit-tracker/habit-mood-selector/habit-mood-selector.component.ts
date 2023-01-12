import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Mood } from 'src/app/habit-tracker/enums/mood';
import { HabitDataService } from 'src/app/shared/services/habit-data.service';

@Component({
  selector: 'app-habit-mood-selector',
  templateUrl: './habit-mood-selector.component.html',
  styleUrls: ['./habit-mood-selector.component.scss'],
})
export class HabitMoodSelectorComponent implements OnInit {
  public enumMood = Mood;
  public moodToday = new FormGroup({});
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private habitDataService: HabitDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params) {
        this.id = +(params.get('id') || '');
      }
    });

    this.moodToday = this.formBuilder?.group({
      eventIndex: [this.id],
      mood: [null, [Validators.required]],
    });
  }

  onSubmitMood() {
    this.habitDataService.setMood(this.moodToday.value);
    //send data to the server//
    this.router.navigate(['/habit-tracker']);
  }
}
