import { Component } from '@angular/core';
import { IEmployee, IFilter } from './employee.model';
import { ModalService } from '../service/modal.service';
import { DataService } from '../service/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  constructor(
    private modalService: ModalService,
    private dataService: DataService
  ) {}
  employeeList: IEmployee[] = [];
  empObj!: IEmployee;
  filterObj!: IFilter;
  employeeDetails: IEmployee | undefined;
  editable: boolean = false;
  mEmployeeList: IEmployee[] = [];

  ngOnInit() {
    const empList = JSON.parse(
      this.dataService.getData('employeeList') as string
    );
    this.mEmployeeList = this.employeeList = [];
    if (empList) {
      this.mEmployeeList = this.employeeList = empList;
    }
    this.filterObj = {};
    this.reset();
  }

  // Employee Details add edit delete methods

  updateForm(id: any) {
    this.editable = true;
    this.modalService.close('1');
    this.openModal('0');
    this.empObj = this.employeeList[id];
  }

  getDetails(index: any) {
    this.employeeDetails = JSON.parse(
      this.dataService.getData('employeeList') as string
    )[index] as IEmployee;
    this.employeeDetails.id = index;
    return this.employeeDetails;
  }

  deleteEmployeeDetails(index: number) {
    if (this.employeeList.length > index) {
      this.employeeList.splice(index, 1);
      this.dataService.setData('employeeList', this.employeeList);
    }
  }

  onSubmit(form: NgForm, id: any) {
    const empList = JSON.parse(
      this.dataService.getData('employeeList') as string
    );
    if (this.editable) {
      const index = empList.findIndex((emp: IEmployee) => emp.id === id);
      this.employeeList[index] = form.form.value;
      this.employeeList[index].id = id;
    } else {
      this.employeeList.push(form.form.value);
      this.employeeList[
        this.employeeList.length - 1
      ].id = `emp_${Math.random().toFixed(6)}`;
    }
    this.mEmployeeList = this.employeeList;
    this.dataService.setData('employeeList', this.employeeList);
    form.form.reset();
    this.closeModal('0');
  }

  reset() {
    this.empObj = {} as IEmployee;
  }

  // Filter form methods

  filter(form: NgForm) {
    let values = form.form.value;
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined) {
        this.mEmployeeList = this.mEmployeeList.filter((emp) => {
          let endDate = emp.end_date ? emp.end_date : new Date();
          if (
            typeof emp[key as keyof IEmployee] === 'string' &&
            (key.toLowerCase() === 'name' || 'job')
          ) {
            return emp[key as keyof IEmployee]
              .toLowerCase()
              .includes(values[key].toLowerCase());
          }
          if (key.toLowerCase() === 'age' || 'start_date') {
            return emp[key as keyof IEmployee] === values[key];
          }
          if (key.toLowerCase() === 'end_date') {
            return endDate === values.end_date;
          }
          return;
        });
      }
    });
  }

  filterReset(form: NgForm) {
    form.reset();
    this.mEmployeeList = this.employeeList;
  }

  // Modal controller methods
  closeModal(id: string): void {
    this.modalService.close(id);
    this.reset();
    this.editable = false;
  }
  openModal(id: string, index?: number) {
    this.modalService.open(id);
    this.reset();
    if (index !== undefined && this.employeeList.length > index) {
      let obj = this.employeeList[index];
      if (obj != null && typeof obj != 'undefined') {
        this.getDetails(index);
      }
    }
  }
}
