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

    // Actual Headers in the Template (comes from API)
    let template_headers = {
      mandatory: ['fa', 'fb', 'fc'],
      optional: ['fd', 'fe']
     };

    this.valid = new Array(this.fileList.length);
    for(let i=0; i<this.fileList.length; i++) {
      this.validate(template_headers, this.fileList[i], i);
    }

  }

  matchHeaders(th, fh: string[]) {
    if ( fh.length < th.mandatory.length ){
      return false;
    }
    else if ( fh.length > (th.mandatory.length + th.optional.length) ) {
      return false;
    }
    else {
      for ( let i=0; i<th.mandatory.length; i++ ) {

        if ( fh.indexOf(th.mandatory[i]) === -1 ) {
          return false;
        }

      }
    }

    return true;
  }


  validate(th, f: File, index: number) {
    let reader = new FileReader();

    reader.onload = () => {
      let hm: boolean = false;
      let rm: boolean = false;

      // (1) Match Headers
      const lines = (reader.result as string).split('\n');
      const fh = lines[0].split(',').map( (x) => { return x.trim(); } );
      console.log(fh);
      console.log(th);
      hm = this.matchHeaders(th, fh);

      if ( hm === true ) {
        // (2) Match Length of All Other Rows to Length of Headers
        rm = true;
        let li: string[];
        for (let i=1; i<lines.length; i++) {

          li = lines[i].split(',').map( (x) => { return x.trim(); } );

          if ( li.length !== fh.length ) {
            rm = false;
            break;
          }
        }
      }

      this.valid[index] = ( hm && rm );

      console.log({index, lines, hm, rm});
      console.log(this.valid);
    };

    reader.readAsText(f);
  }
}
