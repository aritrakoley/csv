import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'validator';

  fileList;
  valid: boolean[];

  selectFiles(event) {
    console.log(event);
    this.fileList = event.target.files;
    console.log(this.fileList);
    console.log(this.fileList.length);
    console.log(this.fileList[0]);
    console.log(typeof(this.fileList));

    let template_headers = ['fa', 'fb', 'fc']; // Actual Headers in the Template (comes from API)

    this.valid = new Array(this.fileList.length);
    for(let i=0; i<this.fileList.length; i++) {
      this.validate(template_headers, this.fileList[i], i);
    }

  }


  matchHeaders(th: string[], fh: string[]) {
    if ( th.length !== fh.length ){
      return false;
    }
    else {

      for ( let i=0; i<th.length; i++ ) {

        if(th[i] !== fh[i]) {
          return false
        }

      }
    }

    return true;
  }


  validate(th: string[], f: File, index: number) {
    let reader = new FileReader();

    reader.onload = () => {

      // (1) Match Headers
      const lines = (reader.result as string).split('\n');
      const fh = lines[0].split(',').map( (x) => { return x.trim(); } );
      console.log(fh);
      console.log(th);
      const hm: boolean = this.matchHeaders(th, fh);

      // (2) Match Length of All Other Rows to Length of Headers
      let rm: boolean = true;
      let li: string[];
      for (let i=1; i<lines.length; i++) {

        li = lines[i].split(',').map( (x) => { return x.trim(); } );

        if ( li.length !== th.length ) {
          rm = false;
          break;
        }
      }

      this.valid[index] = ( hm && rm );

      console.log({index, lines, hm, rm});
      console.log(this.valid);
    };

    reader.readAsText(f);
  }
}
