import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { applicationConstants } from './applicationConstants';
import { CommonFunctionsService } from './commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FileUploadService } from './file-upload.service';
import { Responsemodel } from './responsemodel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'commoncomponent',
  template: '<div></div>'
})
export class CommonComponent implements OnInit {

  orgnizationSetting: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  constructor(private route: Router,
    private spinner: NgxSpinnerService,
    private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService,
    private http: HttpClient
  ) { }

  ngOnInit() {

  }

  //status
  public statusList() {
    let statusList = [
      { label: "Active", value: true },
      { label: "In-Active", value: false }
    ]
    return statusList;
  }

  public status() {
    let statusList = [
      { label: "Active", value: 1 },
      { label: "In-Active", value: 0 }
    ]
    return statusList;
  }

  public genderList() {
    let genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
      { label: 'other', value: 3 }
    ]
    return genderList;
  }

  public mandatoryList() {
    let mandatoryList = [
      { label: "Yes", value: 1 },
      { label: "No", value: 0 }
    ]
    return mandatoryList;
  }

  public documentOpenInNewTab(multipleFilesList: any) {
    const pdfUrl = multipleFilesList[0].imageValue;
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }, error => {
      this.msgs = [];
      this.stopSpinner();
      this.msgs.push({ severity: "error", summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.DOCUMENT_NOT_FOUND });
    });
    return this.msgs;
  }

  //spinner
  startSpinner() {
    this.spinner.show();
  }
  stopSpinner() {
    this.spinner.hide();
  }

  public orgnizationSettings() {
    let val;
    this.dateFormatesList().map(dateformate => {
      if (null != this.organizationDateFormate() && this.organizationDateFormate() != undefined) {
        if (dateformate.datePipe == this.organizationDateFormate()) {
          val = dateformate;
        }
      }
      else {
        if (dateformate.datePipe == "d/MMM/yyyy") {
          val = dateformate;
        }
      }
    })
    return val;
  }

  public dateFormatesList() {
    let dateFormates = [
      { calendar: 'dd/M/yy', datePipe: 'd/MMM/yyyy', dateFormate: 'DD/MMM/YYYY' + ' (' + 'ex:  ' + '14/Mar/2001' + ')' },
      { calendar: 'dd-M-yy', datePipe: 'd-MMM-yyyy', dateFormate: 'DD-MMM-YYYY' + ' (' + 'ex:  ' + '14-Mar-2001' + ')' },
      { calendar: 'mm/dd/yy', datePipe: 'M/d/yyyy', dateFormate: 'MM/DD/YYY' + ' (' + 'ex:  ' + '03/14/2001' + ')' },
      { calendar: 'M/dd/yy', datePipe: 'MMM/d/yyyy', dateFormate: 'MMM/DD/YYYY' + ' (' + 'ex:  ' + 'Mar/14/2001' + ')' },
      { calendar: 'yy/mm/dd', datePipe: 'yyyy/M/d', dateFormate: 'YYYY/MM/DD' + ' (' + 'ex:  ' + '2001/03/14' + ')' },
      { calendar: 'yy/M/dd', datePipe: 'yyyy/MMM/d', dateFormate: 'YYYY/MMM/DD' + ' (' + 'ex:  ' + '2001/Mar/14' + ')' },

    ]
    return dateFormates;
  }

  public organizationDateFormate() {
    return this.commonFunctionsService.getStorageValue(applicationConstants.ORG_DATE_FORMATE)
  }

  public getTimeStamp() {
    let CurrentDate = new Date();
    let hour = CurrentDate.getHours().toString().padStart(2, '0');
    let mins = CurrentDate.getMinutes().toString().padStart(2, '0');
    let secs = CurrentDate.getSeconds().toString().padStart(2, '0');
    return hour + mins + secs;
  }

  nomineeDateOfBirthCheck(incomingDate: any) {
    let flag = true;
    let dateArr = incomingDate.split('/');
    let year = 0;
    let month = 0;
    let day = 0;
    if (dateArr.length >= 2) {
      year = parseInt(dateArr[2], 10);
      month = parseInt(dateArr[1], 10);
      day = parseInt(dateArr[0], 10);
    }

    if (year < 1850) {
      return flag = false;
    } else {
      return flag = true;
    }
  }

  newDateValidation(incomingDate: any) {
    let flag = true;
    let dateArr = incomingDate.split('/');
    let year = 0;
    let month = 0;
    let day = 0;
    if (dateArr.length >= 2) {
      year = dateArr[2];
      month = dateArr[1];
      day = dateArr[0];
    }

    if (month > 12 || month == 0 || day == 0 || year == 0 || day > 31) {
      return flag = false;
    }
    else {
      return flag = true;
    }
  }

  dateCalculationBasedOnAge(age: any) {
    const currentDate = new Date();  // Get the current date
    const birthYear = currentDate.getFullYear() - age;  // Subtract the entered age from the current year
    const birthMonth = currentDate.getMonth();  // Keep the current month
    const birthDate = currentDate.getDate();   // Keep the current day

    // Construct the calculated Date of Birth
    const dob = new Date(birthYear, birthMonth, birthDate);

    // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Format the Date of Birth to 'DD/Mon/YYYY'
    const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
    return formattedDob;

  }

  ageCalculationBasedOnDate(dobVal: any) {
    const dob = new Date(dobVal);  // Parse the date of birth entered by the user
    const currentDate = new Date();  // Get the current date
    let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
    const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
    if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
      age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
    }
    return age;
  }

}