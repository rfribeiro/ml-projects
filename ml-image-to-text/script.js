const recognize = async ({ target: { files }  }) => {
    const data = await Tesseract.recognize(files[0], 'eng+por', {logger: m => console.log(m)})

    console.log(data);
}

  const elm = document.getElementById('uploader');
  elm.addEventListener('change', recognize);