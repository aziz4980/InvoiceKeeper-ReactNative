import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import PureChart from 'react-native-pure-chart';
import firestore from '@react-native-firebase/firestore';
import { DemoButton } from '../components/ui';
// import auth from '@react-native-firebase/auth';


const ReportsScreen = () => {
  const navigation = useNavigation();

  var products = [];
  var amount = [];
  var currentUserID = auth().currentUser?.uid;
  useEffect(() => {
    firestore()
      .collection('invoices')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // console.log('Invoice', documentSnapshot.data().products);
          if(documentSnapshot.data().uid === currentUserID ){  products.push(documentSnapshot.data().products);
          amount.push(documentSnapshot.data().amount);}
        });
      });

      console.log(products)

  }), [];


  const key = 'data';
  var [sampleData, setsampleData] = useState(null);


  const pressMe = () => {
    
      // {
      //   seriesName: 'series1',
      //   data: [
      //     // { x: '2018-02-01', y: 30 },
      //     // { x: '2018-02-02', y: 200 },
      //     // { x: '2018-02-03', y: 170 },
      //     // { x: '2018-02-04', y: 250 },
      //     // { x: '2018-02-05', y: 10 }
      //   ],
      //   color: 'red'
      // }
    
    let graphData=[];
    let data=[];
    console.log("before");
    for (var i = 0; i < products.length; i++) {
      for (var j = 0; j < products[i].length; j++) {
        data.push({ x: products[i][j], y: parseInt(amount[i][j]) });
      }
    }
   // setsampleData(sampleData);
    console.log("after");
  
    let sampleDataReduces = Object.values(data.reduce(getReduced,{}));
    graphData.push({seriesName:'food',color:'red', data:sampleDataReduces})
    console.log(graphData);
    setsampleData(graphData);

  }


function getReduced(total, {x,y}) {
  total[x] = total[x] || {x,y: 0};
  total[x].y += y;
  return total;
}


  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <DemoButton key="Click to view report" onPress={pressMe}>
          {'Click to view report'}
        </DemoButton>

        {/* <PureChart data={sampleData1} type='line' /> */}



      </View>
      <View >
        <Text style={{ color: 'black',
        marginBottom: 20,
        marginTop:20,
    fontWeight: '700',
    fontSize: 16, 
    justifyContent: 'center',
    alignItems: 'center' }}>Product vs amount paid </Text>
      </View>

      { sampleData &&
      <PureChart data={sampleData} 
      height={200}
      width={'100%'}
      type='bar' 
      showEvenNumberXaxisLabel={false}
      />
}
    </ScrollView>
  )
}

export default ReportsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})
