import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'validator';

  fileList;

  selectFiles(event) {
    this.fileList = event.target.files;
    console.log(this.fileList);

    // Actual Headers in the Template (comes from API)
    let template_headers = {
      mandatory: ['fa', 'fb', 'fc'],
      optional: ['fd', 'fe']
     };

    // Calls validation function on each file
    this.validateAllFiles(template_headers, this.fileList);
  }

  validateAllFiles(th, fl) {

    for ( let i=0; i<this.fileList.length; i++ ) {

      this.validate(th, this.fileList[i], i)
      .then((isValid) => console.log('FILE ' + i + ' VALIDATED AS: ', isValid))
      .catch((msg) => console.log( 'ERROR' ));

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

      // (1) Check if all mandatory fields are present
      for ( let i=0; i<th.mandatory.length; i++ ) {

        if ( fh.indexOf(th.mandatory[i]) === -1 ) {
          return false;
        }
      }

      // (2) Check if any unmapped fields are present in fh that are not in th
      for ( let i=0; i<fh.length; i++ ) {

        if ( th.mandatory.indexOf(fh[i]) === -1 && th.optional.indexOf(fh[i]) === -1) {
          return false;
        }
      }
    }

    return true;
  }


  validate(th, f: File, index: number) {

    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        let hm: boolean = false;
        let rm: boolean = false;

        // (1) Match Headers
        const lines = (reader.result as string).split('\n');
        const fh = lines[0].split(',').map( (x) => { return x.trim(); } );

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

        const isValid: boolean = ( hm && rm );

        // JUST FOR DEBUGGING--------------------------------------
        const fn = f.name;
        console.log( { index, fn, lines, hm, rm, isValid } );
        // --------------------------------------------------------

        resolve(isValid);
      };

      reader.readAsText(f);

    });

  }
}
