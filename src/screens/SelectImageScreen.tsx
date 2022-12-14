
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
 
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { DemoButton } from '../components/ui';
import { DemoResponse } from '../components/ui';
import * as ImagePicker from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker/src/types';
import { SelectScreenNavigationProps } from '../navigation/Navigator';
import { recognizeImage, Response } from '../mlkit';

import * as routes from '../navigation/routes';
import { ScrollView } from 'react-native-gesture-handler';
import { FadeInFromBottomAndroidSpec } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';
// import { TouchableOpacity } from 'react-native-gesture-handler/lib/typescript/components/touchables';

type SelectImageScreenProps = {
  navigation: SelectScreenNavigationProps;
};

export const SelectImageScreen = ({ navigation }: SelectImageScreenProps) => {
  const { width } = useWindowDimensions();
  const [response, setResponse] = React.useState<ImagePickerResponse | null>(
    null,
  );



  const pushData = (data) => {
    var invoiceTitle = '';
    var ntnNo = "0043796-4";
    var strNo = '';
    var fbrNo = '';
    var location = '';
    var branchCode = '';
    var invoiceDD = '';
    var invoiceMM = '';
    var invoiceYY = '';
    var quantity = [];
    var product = [];
    var rate = [];
    var amount = [];
    var total;
    var gst;
    var govtCharges;
    var grandTotal;

    data.map((b, bi) => {

      console.log(`Block #${bi} ===> ${b.text}`);
      if (bi == 0) {
        var regExp = /[a-zA-z]/;
        if (regExp.test(b.text)) {
          invoiceTitle = b.text;
        }
        else {
          //if first block is not title
        }
      }

      if (bi == 2 && b.text.match(/\d\d\d\d\d\d\d\d\d\d\d\d\d/)) {
        var str = b.text.split(/[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]:/);
        strNo = str[1];
        // console.log(strNo);
      }
      if (b.text.match(/[a-zA-Z][a-zA-Z][a-zA-Z]\s[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]#/)) {
        // var f = b.text.split(/[a-zA-Z][a-zA-Z][a-zA-Z]\s[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]#/);
        //fbrNo = f[1];
        fbrNo = data[bi + 1].text;
      }
      if (b.text.match(/\d\d-[a-zA-Z][a-zA-Z][a-zA-Z]-\d\d/)) {
        var ele = b.text.split("-");
        invoiceDD = ele[0];
        invoiceMM = ele[1];
        invoiceYY = ele[2];
      }

      if (bi > 11 && !b.text.match(/[a-zA-Z]+.*\([^)]*\)/)) {
        if (bi % 3 == 0 && b.text.match(/\d [a-zA-Z]+ [a-zA-Z][a-zA-Z]/)) {
          var qt = b.text.split(/\d/);
          var pr = b.text.split(/[a-zA-Z]+ [a-zA-Z][a-zA-Z]/);
          quantity.push(pr[0]);
          product.push(qt[1]);
        }
        else if (bi % 3 == 1) {
          if (!isNaN(parseFloat(b.text))) {
            rate.push(b.text);
          }

        }
        else if (bi % 3 == 2 && !b.text.match(/[a-zA-Z]+.*\([^)]*\)/)) {
          if (!isNaN(parseInt(b.text))) {
            amount.push(b.text);
          }

        }


      }
      if (b.text.match(/@.*%/)) {
        if (data[bi - 1].text.match(/[a-zA-Z][a-zA-Z]\./)) {
          var t = data[bi - 1].text.split(/[a-zA-Z][a-zA-Z]\./);
          total = t[1];
        }
        gst = data[bi + 1].text;
        govtCharges = data[bi + 3].text;
        if (data[bi + 5].text.match(/[a-zA-Z][a-zA-Z]\./)) {
          var gt = data[bi + 5].text.split(/[a-zA-Z][a-zA-Z]\./);
          grandTotal = gt[1];
        }
      }

    });
    console.log("Invoice Title: " + `${invoiceTitle}`);
    console.log(`NTN: ${ntnNo}`);
    console.log(`STRN: ${strNo}`);
    console.log(`FBR invoice#: ${fbrNo}`);
    console.log(`Date: ${invoiceDD}`);
    console.log(`Month: ${invoiceMM}`);
    console.log(`Year: ${invoiceYY}`);
    console.log(`QTY: ${quantity}`);
    console.log(`Product: ${product}`);
    console.log(`Rate: ${rate}`);
    amount.pop();
    console.log(`Amount: ${amount}`);
    console.log(`Total: ${total}`);
    console.log(`GST: ${gst}`);
    console.log(`Govt.Charges: ${govtCharges}`);
    console.log(`Grand Total: ${grandTotal}`);

    var currentUserID = auth().currentUser?.uid;
    console.log(currentUserID);
    
 try {
  firestore()
  .collection('invoices')
  .add({
    uid: currentUserID,
    title:invoiceTitle,
    ntn:ntnNo,
    strn:strNo,
    fbr:fbrNo,
    date:invoiceDD,
    month:invoiceMM,
    year:invoiceYY,
    quantity:quantity,
    products:product,
    rate:rate,
    amount:amount,
    total:total,
    gst:gst,
    gc: govtCharges,
    gt:grandTotal,
  })
  .then(() => {
    console.log('successfully added');
     Alert.alert(
"Invoice Processed",
"The invoice has been processed successfully. To view the reports please click \"View Report Button\" ",
[
  {
    text: "Okayy!",
    // onPress: () => Alert.alert("Okayy! Pressed"),
    style: "Okayy!",
  },
],
{
  cancelable: true,
  
}
);
  })
 } catch (error) {
  console.log("error occured", error);
  Alert.alert(
    "Error occured",
    ` ${error}`,
    [
      {
        text: "Okayy!",
        // onPress: () => Alert.alert("Okayy! Pressed"),
        style: "Okayy!",
      },
    ],
    {
      cancelable: true,
      
    }
    )
 }



  }
  useEffect(() => {
    firestore()
      .collection('invoices')
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // console.log('Invoice', documentSnapshot.data().products);
        });
      });
  }, [])

  const [imageTextResponse, setImageTextResponse] = React.useState<Response | null>(null);

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);


  const proccessImage = async (url: string) => {
    if (url) {
      try {
        const response = await recognizeImage(url);
        console.log(response);
        if (response?.blocks?.length > 0) {
          console.log("Image Text Response ====>  ", response);
          setImageTextResponse(response);

          var blocks = response.blocks;
          pushData(blocks);

        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  const onProcessImage = () => {
    if (response) {
      proccessImage(response?.assets?.[0]?.uri!!);

    }
  };

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate("Authentication")
      })
      .catch(error =>  Alert.alert(
        "Error occured",
        ` ${error.message}`,
        [
          {
            text: "Okayy!",
            // onPress: () => Alert.alert("Okayy! Pressed"),
            style: "Okayy!",
          },
        ],
        {
          cancelable: true,
          
        }
        ))
  }


  const onReportScreen = () => {
    navigation.navigate(routes.REPORT_SCREEN);
  }

  const onSearchScreen = () => {
    navigation.navigate(routes.SEARCH_SCREEN);
  }

  return (
    <View style={{}}>

      <View style={{flexDirection:'row', paddingBottom: 8}}>
        
      <DemoButton key="Signout" onPress={handleSignOut} >
            {'Signout'}
          </DemoButton>
          <DemoButton key="SearchScreen" onPress={onSearchScreen}>
            {'Search'}
          </DemoButton>
          </View>
        <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
        
          <DemoButton key="Process Image" onPress={onProcessImage}>
            {'Process Image'}
          </DemoButton>
          <DemoButton key="View Reports" onPress={onReportScreen}>
            {'View Reports'}
          </DemoButton>
        </View>
       
        <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
          <DemoButton
            key="Take Image"
            onPress={() =>
              onButtonPress('capture', {
                saveToPhotos: true,
                mediaType: 'photo',
                includeBase64: false,
              })
            }>
            {'Take Image'}
          </DemoButton>
          <DemoButton
            key="Select Image"
            onPress={() =>
              onButtonPress('library', {
                selectionLimit: 0,
                mediaType: 'photo',
                includeBase64: false,
              })
            }>
            {'Select Image'}
          </DemoButton>
        </View>
        <ScrollView style={{ }}>
          <View style={{ paddingHorizontal: 8, height: 200 }}>
            <DemoResponse blockText={imageTextResponse?.blocks}>
            
            </DemoResponse>
          </View>
         
        </ScrollView>

        {response?.assets &&
          response?.assets.map(({ uri }) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="contain"
                resizeMethod="resize"
                // style={{width, height: width}}
                style={{ height: '60%', width: width }}
                source={{ uri: uri }}
              />
            </View>
          ))}
  

    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    // marginVertical: 24,

    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },

});
