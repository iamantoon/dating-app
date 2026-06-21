import { Component, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  public closeModal = output();
  public submitData = output<MemberParams>();
  public memberParams = model(new MemberParams);

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  public open() {
    this.modalRef.nativeElement.showModal();
  }

  public close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  public submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  public onMinAgeChange() {
    if (this.memberParams().minAge < 18) this.memberParams().minAge = 18;
  }

  public onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams().maxAge = this.memberParams().minAge;
    }
  }
}
