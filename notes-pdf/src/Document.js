import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import "firebase/database";
import "firebase/auth";
import firebase from "firebase/app";
import { PDFViewer } from "@react-pdf/renderer";
import font from "./BadScript-Regular.ttf";
import Selector from "./Selector.js";

require("dotenv").config();

Font.register({ family: "Bad Script", format: "truetype", src: font });

Font.registerEmojiSource({
  format: "png",
  url: "https://twemoji.maxcdn.com/2/72x72/",
});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API,
  authDomain: process.env.REACT_APP_DOM,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_ID,
  storageBucket: process.env.REACT_APP_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT,
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var formRef = database.ref("formData");

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    fontFamily: ["Bad Script"].join(","),
  },
  section: {
    margin: 10,
    padding: 10,
    height: "5.5in",
  },
});

function sectionStyle(stringLength) {
  var fontsize;
  if (stringLength < 400) {
    fontsize = "22";
  }
  if (stringLength > 600) {
    fontsize = "15";
  }
  return {
    margin: 10,
    padding: 10,
    height: "5.5in",
    fontSize: fontsize,
  };
}

// Create Document Component
function MyDocument() {
  const [firebaseData, setFirebaseData] = React.useState(null);
  const [searching, setSearching] = React.useState(false);
  const [parentFacilities, setParentFacilities] = React.useState(null);
  const [parentChecked, setParentChecked] = React.useState(null);

  React.useEffect(() => {
    let child, value;
    if (parentChecked != null && parentChecked["unsentOnly"]) {
      child = "sent";
      value = false;
      formRef.orderByChild(child).equalTo(value).on("value", gotData, errData);
    } else {
      formRef.on("value", gotData, errData);
    }
  }, []);
  React.useEffect(() => {
    console.log(firebaseData === null);
  });

  function callBackFunction(facilities, checked) {
    setParentChecked(checked);
    setParentFacilities(facilities);
    setSearching(true);
  }

  function gotData(data) {
    setFirebaseData(data.val());
  }

  function errData(err) {
    console.log("Error!");
    console.log(err);
  }

  function generateBoolean(data) {
    let result = true;
    var i;
    var keyList = Object.keys(parentFacilities);

    //checked?
    for (i = 0; i < keyList.length; i++) {
      var facilityName = keyList[i];
      var facilityStatus = parentFacilities[facilityName];
      var entryFacility = data[1]["facility"];
      console.log(
        "Facility Name: " +
          facilityName +
          " Facility Status: " +
          facilityStatus +
          " entryFacility:" +
          entryFacility
      );
      if (facilityStatus === false && entryFacility === facilityName) {
        result = false;
      }
    }

    //approved? if filter for approval only is on and the entry is not approved
    if (parentChecked["approvalOnly"] && data[1]["approved"] === false) {
      result = false;
    }

    //sent? if filter for unSent only is on and the entry is sent
    if (parentChecked["unsentOnly"] && data[1]["sent"] === true) {
      result = false;
    }

    return result;
  }

  if (!searching) {
    return <Selector callBack={callBackFunction} />;
  } else if (firebaseData === null) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    console.log(firebaseData);
    return (
      <PDFViewer style={{ width: "100vw", height: "100vw" }}>
        <Document>
          <Page size="A4" style={styles.page}>
            {Object.entries(firebaseData).map((data) =>
              generateBoolean(data) ? (
                <View style={sectionStyle(data[1]["note"].length)} wrap={false}>
                  <Text>
                    Dear{" "}
                    {data[1]["frontliner"].substring(
                      0,
                      data[1]["frontliner"].length - 1
                    )}
                    ,{" "}
                  </Text>
                  <Text>{` `}</Text>
                  <Text>
                    {data[1]["note"]
                      .replace(/(\r\n|\n|\r)/gm, "")
                      .replace("Dear Nursing Home worker,", "")
                      .replace("Dear Health Care Worker,", "")
                      .replace("Dear Healthcare worker,", "")}
                  </Text>
                  <Text style={{ textAlign: "right" }}>
                    -From {data[1]["sender"]}
                  </Text>
                </View>
              ) : null
            )}
          </Page>
        </Document>
      </PDFViewer>
    );
  }
}
export default MyDocument;
