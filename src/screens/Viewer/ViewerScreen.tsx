/**
 * ViewerScreen Component
 *
 * The ViewerScreen component displays detailed information about a specific book.
 * @component
 *
 * @returns {ReactNode} - The rendered ViewerScreen component.
 */

import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../../components/Wrapper';
import Toast from 'react-native-toast-message';

import {getBookDetails} from '../../services/Services';
import {useNavigation, useRoute} from '@react-navigation/native';
import ResponseType, {Book, BookDetails} from '../../models/ResponseType';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import FastImage from 'react-native-fast-image';
import {darkGradient, lightGradient, useAppTheme} from '../../theme/Theme';
import {Appbar, Chip, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

const ViewerScreen = () => {
  const {colors} = useAppTheme();
  const {goBack} = useNavigation();

  // Accessing book details from the Redux store
  const params = useSelector((state: any) => state.books?.bookItem);
  console.log('params---', params);

  // Ref for aborting API calls on component unmount
  const controller = useRef(new AbortController());

  // State to manage loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //State to store the book details
  const [data, setData] = useState<BookDetails | null>(null);

  // Current theme based gradient display
  const gradient = useColorScheme() == 'dark' ? darkGradient : lightGradient;

  // Component to render each card section
  const RenderCard = ({title, description}: any) => {
    if (title) {
      return (
        <View style={styles.cardContainer}>
          <Text style={styles.card} variant="titleMedium">
            {title}
          </Text>
          <Text variant="bodyLarge">{description}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  // Function to fetch book details
  const fetchData = async () => {
    try {
      setIsLoading(prev => !prev);
      if (params) {
        const {id} = params;
        const {response, message, isError}: ResponseType = await getBookDetails(
          id,
          controller.current.signal,
        );
        console.log('rsp----', response);

        if (!isError) {
          setData(response.data);
          Toast.show({
            type: 'successToast',
            text1: 'Sucess',
            text2: message,
          });
          setIsLoading(prev => !prev);
        } else {
          setIsLoading(prev => !prev);
          Toast.show({
            type: 'errorToast',
            text1: 'Oops!',
            text2: message,
          });
        }
      } else throw {};
    } catch (error) {
      setIsLoading(prev => !prev);
      const {message}: any = error;
      console.log('errrrr----', error);

      Toast.show({
        type: 'errorToast',
        text1: 'Oops!',
        text2: message,
      });
    }
  };
  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
    return () => {
      // Aborting the current progressing API calls before component unmounts
      controller.current.abort();
    };
  }, []);

  return (
    <Wrapper>
      {/* Items won't display when the component in loading state */}
      {!isLoading ? (
        <ScrollView style={styles.container}>
          <View style={styles.wrapper}>
            <Appbar.BackAction
              onPress={() => {
                goBack();
              }}
            />
            <View
              style={[
                styles.coverContainer,
                {backgroundColor: colors.surface},
              ]}>
              {data?.cover_img ? (
                <FastImage
                  style={styles.cover}
                  source={{
                    uri: data.cover_img,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <View
                  style={[
                    styles.emptyCover,
                    {backgroundColor: colors.surfaceDisabled},
                  ]}
                />
              )}
            </View>
            <View style={styles.heading}>
              <Text variant="headlineLarge">{data?.title || '---'}</Text>
            </View>
            <View>
              <Text style={styles.description} variant="bodyLarge">
                {data?.description || '---'}
              </Text>
            </View>

            <RenderCard
              title={'SUBJECTS'}
              description={data?.subjects || '---'}
            />
            <RenderCard
              title={'SUBJECT PLACES'}
              description={data?.subject_places || '---'}
            />
          </View>
        </ScrollView>
      ) : null}

      {isLoading && <CustomActivityIndicator />}
    </Wrapper>
  );
};

export default ViewerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  emptyCover: {
    width: 220,
    height: 280,
    overflow: 'hidden',
    borderRadius: 12,
  },
  textStyle: {
    textAlign: 'center',
  },
  wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  chipContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,

    marginRight: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  description: {
    paddingVertical: 12,
  },
  imageStyle: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.6,
  },
  heading: {
    marginVertical: 12,
    justifyContent: 'flex-start',
  },
  cover: {
    width: 220,
    height: 280,
    overflow: 'hidden',
  },
  coverContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
  },

  cardContainer: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  card: {paddingBottom: 4},
});
