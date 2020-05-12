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
    const templateHeaders = ['fa', 'fb', 'fc'];

    // Calls validation function on each file
    this.validateAllFiles(templateHeaders, this.fileList);
  }

  validateAllFiles(th, fl) {

    for ( let i = 0; i < this.fileList.length; i++ ) {

      this.validate(th, this.fileList[i], i)
      .then((isValid) => console.log('FILE ' + i + ' VALIDATED AS: ', isValid))
      .catch((msg) => console.log( 'ERROR' ));

    }
  }

  matchHeaders(th, fh: string[]): boolean {
    // Assumes all fields in th are mandatory
    if ( fh.length < th.length ){
      return false;
    }
    else {
      // (1) Check if all fields are present
      for ( let i=0; i<th.length; i++ ) {

        if ( fh.indexOf(th[i]) === -1 ) {
          return false;
        }

      }
    }

    return true;
  }

  validate(th, f: File, index: number) {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {

        const lines = (reader.result as string).split('\n');
        const fh = lines[0].split(',').map( x => x.trim() );

        // console.log({f, index, lines});
        resolve(this.matchHeaders(th, fh));
      };

      reader.readAsText(f);

    });

  }
}
