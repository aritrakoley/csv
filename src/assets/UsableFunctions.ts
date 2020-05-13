validateAllFiles(apiResponse, fileList) {

    const templateHeaders = this.getTemplateHeaders(apiResponse);

    for ( let i = 0; i < fileList.length; i++ ) {

      this.validate(templateHeaders, fileList[i], i)
      .then((isValid) => console.log('FILE ' + i + ' VALIDATED AS: ', isValid))
      .catch((msg) => console.log( msg ));

    }
  }

  getTemplateHeaders(apiResponse) {
    const tf =  apiResponse.result.template_form;

    let hdrs = new Array();
    for(let i = 0; i < tf.length; i++) {
      hdrs.push(tf[i].default_value);
    }

    return hdrs;
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

      reader.onerror = (e) => {
        reader.abort();
        reject("File could not be read!");
      };

      reader.readAsText(f);

    });

  }