import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HabitService } from 'src/app/shared/services/habit.service';
import { Freqeuncy } from 'src/app/habit-tracker/enums/frequency';
import { IconColor } from 'src/app/habit-tracker/enums/icon-color';
import { IconImage } from 'src/app/habit-tracker/enums/icon-image';
import { ActivatedRoute } from '@angular/router';
import { Habit } from 'src/app/shared/models/habit';
import { Store } from '@ngxs/store';
import { HabitState } from 'src/app/store/habit.state';

@Component({
  selector: 'app-habit-edit',
  templateUrl: './habit-edit.component.html',
  styleUrls: ['./habit-edit.component.scss'],
})
export class HabitEditComponent implements OnInit {
  public habitForm = new FormGroup({});
  private habitData?: Habit;
  public enumFrequency = Freqeuncy;
  public enumIconColor = IconColor;
  public enumIconImage = IconImage;
  private editMode: boolean = false; // html button = "submit"
  private id?: string;

  constructor(
    private formBuilder: FormBuilder,
    private habitService: HabitService,
    private activatedroute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.id = this.activatedroute.snapshot.paramMap.get('id') || '';
    console.log(this.id);
    if (this.id) {
      this.editMode = true; // html button = "save the change"
      this.habitData = this.store.selectSnapshot(HabitState.getHabitbyId)(
        this.id
      );
      this.initForm(this.habitData);
      this.habitForm.addControl('id', new FormControl(this.id)); // form automatically pass ID when editMode
      console.log(this.habitData);
    } else {
      this.initForm();
    }
  }

  onSaveHabit() {
    console.log(this.habitForm);
    // this.habitService.upsertHabit(this.habitForm.value).subscribe();
    // loading spinner -> submission successful! ->
    // this.habitForm.reset(); -> redirect to mainpage after 3 sec (countdown)
  }

  onSelectRandIconImg() {
    const enumValues = Object.values(this.enumIconImage);
    let selectedImg = enumValues[Math.floor(Math.random() * enumValues.length)];
    this.habitForm.patchValue({
      iconImage: selectedImg,
    });
  }

  onSelectRandIconColor() {
    const enumValues = Object.values(this.enumIconColor);
    let selectedColor =
      enumValues[Math.floor(Math.random() * enumValues.length)];
    this.habitForm.patchValue({
      iconColor: selectedColor,
    });
  }

  private initForm(habit?: Habit) {
    this.habitForm = this.formBuilder?.group({
      habitName: [habit?.habitName ?? '', [Validators.required]],
      frequency: [habit?.frequency ?? '', [Validators.required]],
      countPerFreq: [
        habit?.countPerFreq ?? '',
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
      iconImage: [habit?.iconImage ?? '', [Validators.required]],
      iconColor: [habit?.iconColor ?? '', [Validators.required]],
    });
  }
}
