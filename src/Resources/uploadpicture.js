import React, { useState } from "react";
import { storage, database } from "../firebase";
import { ref as refdb, set, child } from "firebase/database";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Navigate } from "react-router-dom";

const UploadPicture = (props) => {
  const [imageurl, setimageurl] = useState(null);
  const [selectedFile, setUploadFile] = useState(null);
  const [progress, setProgress] = useState();

  const storageRef = ref(storage);
  const profilePicFolderRef = ref(storageRef, "ProfilePictures");

  const imagesRef = ref(
    profilePicFolderRef,
    progress === 100 ? selectedFile.name : "soundonly_1_re.jpg"
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
    const storageRef = ref(
      storage,
      `ProfilePictures/${props.info.userID}/${selectedFile.name}`
    );
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

  const setAsNewProfile = (event) => {
    event.preventDefault();
    props.setter((prev) => ({
      ...prev,
      profilePicURL: `${props.info.userID}/${selectedFile.name}`,
    }));

    const messagesRef = refdb(database, "users/user");
    const childRef = child(messagesRef, "profilePicURL");
    set(childRef, `${props.info.userID}/${selectedFile.name}`);
    return <Navigate to="/Profile" />;
  };

  return (
    <div>
      <label>Upload a new Profile Picture</label>
      {imageurl != null && (
        <img style={{ width: 300, height: 300 }} src={imageurl} alt="lolz" />
      )}
      <form style={{ top: 380 }} onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <br />
        <input type="submit" value="Upload" />
      </form>
      <h3 style={{ top: 400 }}>{progress === 100 && "Upload Completed"}</h3>
      {progress === 100 && (
        <div>
          <form style={{ top: 450 }} onSubmit={setAsNewProfile}>
            <label>Confirm new Profile Picture</label>
            <br />
            <input type="submit" value="OK" />
          </form>
        </div>
      )}
    </div>
  );
};

export { UploadPicture };
