# FakeShareX

Just like the name (doesn't really) implies, this is a fake sharex backend.

Just upload an object that fits

```json
{
  "name": "",
  "size": "",
  "type": "",
  "file": ""
}
```

Where file is a base64 encoded image and name includes the file type (.png, .gif, etc...)

I am a react developer, so here's a react snippet using dropzone:

"developer" so im not gonna include any comments or context

<details>
  <summary>
    Click to Expand
  </summary>

```jsx
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";


export default function Uploader() {
  const [files, setFiles] = useState<FakeFile[]>([]);
  interface FakeFile {
    name: string;
    size: number;
    type: string;
    file: any;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // setFiles(acceptedFiles);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);

        // setFiles((prev) => [...prev, binaryStr]);
        const tmp = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: binaryStr,
        };
        setFiles((prev) => [...prev, tmp]);
        fetch("http://localhost:10000/api/upload", {
          method: "POST",
          body: JSON.stringify({
            file: [_arrayBufferToBase64(tmp.file)],
            name: tmp.name,
          }),
          // body: JSON.stringify({ balls: "true" }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => console.log(res));
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  function _arrayBufferToBase64(buffer: any) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  return (
    <div>
      <Dropzone onDrop={onDrop}
      noClick
      // noclick


      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {/* <Chat> */}
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      {files.map((file) => (
        <div key={file.name}>
          {_arrayBufferToBase64(file.file)}
          <img
            src={"data:image/jpg;base64, " + _arrayBufferToBase64(file.file)}
            // src={URL.createObjectURL(file)}
            alt=""
          />
          <button
            onClick={() => {
              console.log(file);
              // console.log(form.get("files[]"));
              fetch("http://localhost:10000/api/upload", {
                method: "POST",
                body: JSON.stringify({
                  file: [_arrayBufferToBase64(file.file)],
                  name: file.name,
                }),
                // body: JSON.stringify({ balls: "true" }),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              })
                .then((res) => res.json())
                .then((res) => console.log(res));

              // var obj: any = {};
              // form.forEach((value, key) => (obj[key] = value));
              // var json = JSON.stringify(obj);
            }}
          >
            Upload
          </button>
        </div>
      ))}
    </div>
  );
}


```

</details>

When the post request hits this server, the server saves it and returns the name it generates for the file. The file is saved and served under /uploads.

## App initialized by @alexng353/typescript-generator

## Development

- Run `npm run dev` to start development.

## Production

- Run `npm run start` to start the app.
