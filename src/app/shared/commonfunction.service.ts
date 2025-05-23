import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { applicationConstants } from '../shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { Responsemodel } from './responsemodel';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class CommonFunctionsService {

  date: any;
  orgnizationSetting: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  subProductList: any[] = [];
  public dataSource = new BehaviorSubject<any>(this.getStorageValue('language') || 'en');
  data: any = this.dataSource.asObservable();

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private datePipe: DatePipe,
    private fileUploadService: FileUploadService) {
  }

  saveAuthToken(val: any): void {
    this.storage.set(applicationConstants.HEADER_AUTHEN_KEY, val);
  }

  getAuthToken(): any {
    let authToken: any = this.storage.get(applicationConstants.HEADER_AUTHEN_KEY);
    return authToken;
  }
  setUserInSession(val: any): void {
    this.storage.set(applicationConstants.HEADER_USER_KEY, val);
  }

  getUserFromSession(): any {
    let userid: number = this.storage.get(applicationConstants.HEADER_USER_KEY);
    return userid;
  }

  removeToken(): any {
    this.storage.remove(applicationConstants.HEADER_USER_KEY);
    this.storage.remove(applicationConstants.HEADER_AUTHEN_KEY);
    this.storage.remove(applicationConstants.ORG_DATE_FORMATE);
    this.storage.remove(applicationConstants.roleId);
    this.storage.remove(applicationConstants.roleName);
    this.storage.remove(applicationConstants.institutionId);
  }

  setStorageValue(constants: any, val: any): void {
    this.storage.set(constants, val);
  }

  getStorageValue(constant: any): any {
    return this.storage.get(constant);
  }

  removeStorageValue(constant: any): void {
    this.storage.remove(constant);
  }

  getUTCEpoch(date: any) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let d = Date.UTC(year, month, day);
    return d;
  }

  getUTCEpochWithTime(dateVal: Date) {
    let givenDate = new Date(dateVal);
    let year = givenDate.getUTCFullYear();
    let month = givenDate.getUTCMonth();
    let day = givenDate.getUTCDay();
    let hour = givenDate.getUTCHours();
    let mins = givenDate.getUTCMinutes();
    let secs = givenDate.getUTCSeconds();
    let d = Date.UTC(year, month, day, hour, mins, secs);
    return d;
  }

  languageSelection(data: any) {
    this.dataSource.next(data);
  }

  /**
     * converting html to type string
     * @returns  string data
     */
  convertHTMLtoString(html: any) {
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  convertLocalDatetoUTCDateWithoutTime(year: any, month: any) {
    return this.getUTCEpoch(new Date(year, month))
  }

  convertLocalDatetoUTCDateWithTime(date: any) {
    return this.getUTCEpoch(new Date(date))
  }

  getFinancialYear() {
    let month = new Date().getMonth();
    let financialYear = '';
    if (month > 2) {
      financialYear = financialYear + new Date().getFullYear() + "-" + (new Date().getFullYear() + 1);
    } else {
      financialYear = financialYear + (new Date().getFullYear() - 1) + "-" + new Date().getFullYear();
    }
    return financialYear;
  }

  monthDiff(dateFrom: Date, dateTo: Date) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  getUTCEpochWithTimedateConversionToLong(dataVal: any) {
    if (dataVal != null && dataVal != undefined) {
      let dateSplit: any[] = dataVal.split('/');
      if (dateSplit != null && dateSplit != undefined && dateSplit.length >= 3) {
        this.date = this.getUTCEpoch(new Date(dateSplit[2], Number(dateSplit[1]) - 1, dateSplit[0], 0, 0, 0));
      }
    }
    return this.date;
  }

  dateConvertionIntoFormate(date: any) {
    const formattedDate = this.datePipe.transform(new Date(date), 'dd/MMM/yyyy');
    let dateVal = formattedDate;
    return dateVal;
  }
  currentDate() {
    let date = new Date();
    const formattedDate = this.datePipe.transform(new Date(date), 'dd/MMM/yyyy');
    return formattedDate;
  }

  dateConvertsionToLong(dataVal: any) {
    const formattedDate = dataVal.toUTCString();
    const timestamp = Math.floor(dataVal.getTime() / 1000);
    return timestamp;
  }

  private ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  private tens = ['', '', 'Twenty', 'Thirty', 'Fourty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  convertToWords(num: number): string {
    if (num === 0) return 'Zero rupees only';
    return this.convert(num) + ' rupees only';
  }

  public convert(num: number): string {
    if (num < 20) {
      return this.ones[num];
    } else if (num < 100) {
      return this.tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + this.ones[num % 10] : '');
    } else if (num < 1000) {
      return this.ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + this.convert(num % 100) : '');
    } else if (num < 100000) {
      return this.convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + this.convert(num % 1000) : '');
    } else if (num < 10000000) {
      return this.convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + this.convert(num % 100000) : '');
    } else {
      return this.convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + this.convert(num % 10000000) : '');
    }
  }

  subProductFilterWithMembershipSubProductId(subProductList: any, productId: any) {
    let isAClass: any;
    if (subProductList != null && subProductList != undefined && subProductList.length > 0 && productId != null && productId != undefined) {
      isAClass = subProductList.find((obj: any) => obj.value == productId && obj.isAclass);
      if (isAClass != null && isAClass != undefined) {
        isAClass = true;
      }
      else {
        isAClass = false;
      }
      return isAClass;
    }
  }

  subProductNameMappingWithMemberType(subProductList: any, memberTypeName: any, productId: any) {
    let memberShipTypeNameWithProductName: any;
    if (subProductList != null && subProductList != undefined && subProductList.length > 0 && productId != null && productId != undefined) {
      let subproductName = subProductList.find((obj: any) => obj.value == productId);
      if (subproductName != null && subproductName != undefined)
        memberShipTypeNameWithProductName = memberTypeName + "(" + subproductName.label + ")";
    }
    return memberShipTypeNameWithProductName;
  }

  permnaneCommunicationDetailsAddressDetailsConcatination(obj: any) {
    let permanentAddress;
    const capitalizeFirstLetter = (str: string) => {
      if (str && str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      return str;

    };

    // with block and division
    if (
      obj.permanentAddress1 != null && obj.permanentAddress1 != undefined && obj.permanentBlockName != null && obj.permanentBlockName != undefined && obj.permanentDivisionName != null && obj.permanentDivisionName != undefined &&
      obj.permanentVillageName != null && obj.permanentVillageName != undefined && obj.permanentSubDistrictName != null && obj.permanentSubDistrictName != undefined &&
      obj.districtName != null && obj.districtName != undefined && obj.stateName != null && obj.stateName != undefined && obj.pincode != null && obj.pincode != undefined
    ) {
      permanentAddress =
        capitalizeFirstLetter(obj.permanentAddress1) + ", " + obj.permanentVillageName + ", " + obj.permanentBlockName + ", " + obj.permanentDivisionName + ", " +
        obj.permanentSubDistrictName + ", " + obj.permanentDistrictName + ", " + obj.permanentStateName + ", " + "PINCODE- " + obj.permanentPincode + ".";
    }
    // without block and division
    else if (
      obj.permanentAddress1 != null && obj.permanentAddress1 != undefined && obj.permanentVillageName != null && obj.permanentVillageName != undefined &&
      obj.permanentSubDistrictName != null && obj.permanentSubDistrictName != undefined && obj.districtName != null && obj.districtName != undefined && obj.stateName != null &&
      obj.stateName != undefined && obj.pincode != null && obj.pincode != undefined
    ) {
      permanentAddress =
        capitalizeFirstLetter(obj.permanentAddress1) + ", " + obj.permanentVillageName + ", " + obj.permanentSubDistrictName + ", " + obj.permanentDistrictName + ", " + obj.permanentStateName +
        ", " + "PINCODE- " + obj.permanentPincode + ".";
    }

    return permanentAddress;
  }

  communicationDetailsAddressDetailsConcatination(obj: any) {
    let registeredAddress;
    const capitalizeFirstLetter = (str: string) => {
      if (str && str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      return str;
    };

    // with block and division
    if (
      obj.address1 != null && obj.address1 != undefined && obj.blockName != null && obj.blockName != undefined && obj.divisionName != null && obj.divisionName != undefined &&
      obj.villageName != null && obj.villageName != undefined && obj.subDistrictName != null && obj.subDistrictName != undefined && obj.districtName != null && obj.districtName != undefined &&
      obj.stateName != null && obj.stateName != undefined && obj.pincode != null && obj.pincode != undefined
    ) {
      registeredAddress =
        capitalizeFirstLetter(obj.address1) + ", " + obj.villageName + ", " + obj.blockName + ", " + obj.divisionName + ", " + obj.subDistrictName + ", " + obj.districtName +
        ", " + obj.stateName + ", " + "PINCODE- " + obj.pincode + ".";
    }
    // without block and division
    else if (
      obj.address1 != null && obj.address1 != undefined && obj.villageName != null && obj.villageName != undefined && obj.subDistrictName != null && obj.subDistrictName != undefined &&
      obj.districtName != null && obj.districtName != undefined && obj.stateName != null && obj.stateName != undefined && obj.pincode != null && obj.pincode != undefined
    ) {
      registeredAddress =
        capitalizeFirstLetter(obj.address1) + ", " + obj.villageName + ", " + obj.subDistrictName + ", " +
        obj.districtName + ", " + obj.stateName + ", " + "PINCODE -" + obj.pincode + ".";
    }

    return registeredAddress;
  }

  minMaxAgeCheck(minAge: any, maxAge: any) {
    let check: boolean = false;
    if (minAge != null && minAge != undefined && maxAge != null && maxAge != undefined && minAge > maxAge) {
      check = true;
    }
    return check;
  }

  convertAmountToWords(amount: number): string {
    if (amount === null || amount === undefined) return '';

    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const numToWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000)
        return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + numToWords(n % 100) : '');
      if (n < 100000)
        return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000)
        return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + numToWords(n % 10000000) : '');
    };

    if (amount === 0) {
      return 'Zero';
    }

    const words = numToWords(amount);
    const amountInwords = words + ' Rupees Only';
    return amountInwords;
  }

  convertAmountWithDecimalsToWords(value: number): string {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];

    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function integerToWords(numStr: string): string {
      if ((numStr = numStr.toString()).length > 9) return 'overflow';
      const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return '';
      let str = '';
      str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[+n[1][0]] + ' ' + a[+n[1][1]]) + 'Crore ' : '';
      str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[+n[2][0]] + ' ' + a[+n[2][1]]) + 'Lakh ' : '';
      str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[+n[3][0]] + ' ' + a[+n[3][1]]) + 'Thousand ' : '';
      str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[+n[4][0]] + ' ' + a[+n[4][1]]) + 'Hundred ' : '';
      str += (Number(n[5]) !== 0) ? ((str !== '') ? 'And ' : '') + (a[Number(n[5])] || b[+n[5][0]] + ' ' + a[+n[5][1]]) : '';
      return str;
    }

    const formatted = value.toString();
    const [integerPart, decimalPart] = formatted.split('.');

    const words = integerToWords(integerPart);
    if (decimalPart !== '00' && decimalPart != undefined && decimalPart != null) {
      return `${words}Rupees and ${integerToWords(decimalPart)}Paisa Only`;
    } else {
      return `${words}Rupees Only`;
    }
  }

}