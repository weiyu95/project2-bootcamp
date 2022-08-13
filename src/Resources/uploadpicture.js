import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { Outlet, Link } from "react-router-dom";

const UploadPicture = () => {
  const [imageurl, setimageurl] = useState(null);
  const [selectedFile, setUploadFile] = useState(null);
  const [progess, setProgress] = useState();

  const storageRef = ref(storage);

  const imagesRef = ref(
    storageRef,
    selectedFile != null ? selectedFile.name : "soundonly_1_re.jpg"
  );

  getDownloadURL(imagesRef)
    .then((url) => {
      setimageurl(url);
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          window.alert("File doesn't exist"); // File doesn't exist
          break;
        case "storage/unauthorized":
          window.alert("User doesn't have permission to access the object"); // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          window.alert("User canceled the upload"); // User canceled the upload
          break;
        case "storage/unknown":
          window.alert("Unknown error occurred, inspect the server response"); // Unknown error occurred, inspect the server response
          break;
        default:
          window.alert("critical error");
          break;
      }
    });

  const handleChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const storageRef = ref(storage, `iamges/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on("state_changed", (snapshot) => {
      const prog = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(prog);
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        default:
          break;
      }
    });
  };

  return (
    <div>
      {imageurl != null && <img src={imageurl} alt="lolz" />}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <br />
        <input type="submit" value="Upload" />
      </form>
      <h3>{progess === 100 && "upload Completed"}</h3>
    </div>
  );
};

export { UploadPicture };
