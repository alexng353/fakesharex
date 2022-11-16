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

interface Props {
  children: React.ReactNode;
}

export default function Uploader({ children }: Props) {
  const [files, setFiles] = useState<FakeFile[]>([]);
  interface FakeFile {
    name: string;
    size: number;
    type: string;
    file: any;
    return?: {
      data: [
        {
          path: string;
        }
      ];
      message: string;
    };
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
        const tmp = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: binaryStr,
        };
        fetch("http://localhost:10000/api/v2/upload", {
          method: "POST",
          body: JSON.stringify({
            files: [
              {
                name: file.name,
                size: file.size,
                type: file.type,
                file: _arrayBufferToBase64(tmp.file),
              },
            ],
          }),
          // body: JSON.stringify({ balls: "true" }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            const listOfUrls = res.data.map((file: any) => {
              return `http://localhost:10000/uploads/${file.path}`;
            });
            console.log(listOfUrls);
            const tmp = {
              name: file.name,
              size: file.size,
              type: file.type,
              file: binaryStr,
              return: res,
            };
            console.log(tmp);

            setFiles((prev) => [...prev, tmp]);
          });
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
      <Dropzone onDrop={onDrop}>
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
      {files.map((file, index: any) => (
        <div key={index}>
          {/* {_arrayBufferToBase64(file.file)} */}
          <img
            className="max-h-96"
            src={"data:image/jpg;base64, " + _arrayBufferToBase64(file.file)}
            // src={URL.createObjectURL(file)}
            alt=""
          />
          {file?.return?.data[0] && (
            <button
              //onclick copy https://content.edubeyond.dev/${file.return.path} to clipboard
              onClick={() => {
                if (!file.return?.data[0].path) {
                  console.log("url not found");
                  return;
                }
                const url = `http://localhost:10000/uploads/${file.return?.data[0].path}`;
                navigator.clipboard.writeText(url);
              }}
            >
              <span className="hover:underline text-blue-500 active:text-blue-600">
                {file.return?.data[0].path}
              </span>
            </button>
          )}
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
