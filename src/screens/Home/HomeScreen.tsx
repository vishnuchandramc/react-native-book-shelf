/**
 * HomeScreen Component
 *
 * The HomeScreen component represents the main screen of the application where users can
 * search for books and view a list of search results. It includes search functionality,
 * a list of book items, and navigation to the ViewerScreen for detailed book information.
 *
 * @component
 *
 * @returns {ReactNode} - The rendered HomeScreen component.
 */

import {RefreshControl, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {getBooksList} from '../../services/Services';
import ResponseType, {Book} from '../../models/ResponseType';
import Toast from 'react-native-toast-message';
import Wrapper from '../../components/Wrapper';
import {Searchbar, Text, TouchableRipple} from 'react-native-paper';
import {useAppTheme} from '../../theme/Theme';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MODALS, SCREENS, STRINGS} from '../../constants/AppConstants';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import {useDispatch} from 'react-redux';
import {storeBookInfo} from '../../store/Reducer';
import ListFooterComponent from '../../components/ListFooterComponent';
import {isConnected} from '../../helpers/NetworkUtils';
import {FlatGrid} from 'react-native-super-grid';
import {MotiView} from 'moti';

const HomeScreen = () => {
  const {colors} = useAppTheme();
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const controller = useRef(new AbortController());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchValue, setSearchValue] = useState('harry potter');
  const [data, setData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Fetching the data from the API
  const fetchData = async () => {
    try {
      const connectionStatus: any = await isConnected();
      console.log('Connection---', connectionStatus);

      if (connectionStatus) {
        setIsLoading(prev => !prev);
        const {response, message, isError}: ResponseType = await getBooksList(
          searchValue,
          null,
        );
        if (!isError) {
          setData(response.data);
          console.log('Home screen data get ----', response.data);

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
      } else {
        // @ts-ignore
        navigate(MODALS.FALLBACK_MODAL);
      }
    } catch (error) {
      setIsLoading(prev => !prev);
      console.log('errorssssss', error);
      const {message}: any = error;
      Toast.show({
        type: 'errorToast',
        text1: 'Oops!',
        text2: message,
      });
    }
  };
  // Initial Function call
  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        // Aborting the current progressing API calls
        controller.current.abort();
      };
    }, [searchValue]),
  );

  //Executed when the user utilising the pull to refresh functionality
  const handleRefresh = useCallback(() => {
    handleClearSearch();
    setSearchQuery('');
    fetchData();
  }, []);

  // Component for pull to refresh functionality
  const handleRefreshControl = (
    <RefreshControl refreshing={false} onRefresh={handleRefresh} />
  );

  // Book list item with press to view feature
  const renderBookItem = ({item, index}: any) => {
    return (
      <MotiView
        from={{opacity: 0, translateY: 50}}
        animate={{opacity: 1, translateY: 0}}
        transition={{delay: index * 20}}>
        <TouchableRipple
          onPress={() => handlePress(item)}
          style={styles.itemContainer}>
          <>
            <View style={styles.posterContainer}>
              {item.cover_img ? (
                <FastImage
                  style={styles.poster}
                  source={{
                    uri: item.cover_img,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <View
                  style={[
                    styles.emptyPoster,
                    {backgroundColor: colors.surfaceDisabled},
                  ]}
                />
              )}
            </View>
            <View style={styles.itemDescriptionContainer}>
              <Text style={styles.center} variant="titleMedium">
                {item.title}
              </Text>
              <Text style={styles.center} variant="bodyLarge">
                {item.author[0]}
              </Text>
              <Text style={styles.center} variant="bodyMedium">
                {item.first_publish_year}
              </Text>
            </View>
          </>
        </TouchableRipple>
      </MotiView>
    );
  };

  // Executes when the user press clear button in the search
  const handleClearSearch = () => {
    setSearchValue('harry potter');
  };
  // Executes when the user press enter button from keyboard
  const handleSubmitEditing = () => {
    if (searchQuery == '') {
      setSearchValue('harry potter');
    } else {
      setSearchValue(searchQuery);
    }
  };

  //Footer component for flashlist
  const listFooterComponent = useCallback(() => {
    return data && !isLoading ? <ListFooterComponent /> : null;
  }, []);

  //Executes when user press any item
  const handlePress = (item: Book) => {
    dispatch(storeBookInfo(item));
    // @ts-ignore
    navigate(SCREENS.VIEWER_SCREEN);
  };
  return (
    <Wrapper>
      <View style={styles.container}>
        <Text style={{width: '70%'}} variant="headlineMedium">
          {STRINGS.SEARCH}
        </Text>
        <Searchbar
          mode="bar"
          style={[styles.searchbar]}
          placeholder={searchValue}
          placeholderTextColor={colors.onSurfaceDisabled}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSubmitEditing}
          value={searchQuery}
          onClearIconPress={handleClearSearch}
        />
        {data.length > 0 ? (
          <FlatGrid
            itemDimension={130}
            data={data}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderBookItem}
            ListFooterComponent={listFooterComponent}
            refreshControl={handleRefreshControl}
          />
        ) : !isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={{color: colors.surfaceDisabled}} variant="titleLarge">
              No data
            </Text>
          </View>
        ) : null}
      </View>
      {isLoading && <CustomActivityIndicator />}
    </Wrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  searchbar: {
    marginVertical: 12,
  },
  listContainer: {
    height: '100%',
    width: '100%',
  },
  itemContainer: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterContainer: {
    // width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  center: {textAlign: 'center'},
  poster: {
    width: 100,
    height: 138,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyPoster: {
    width: 80,
    height: 118,
    borderRadius: 8,
  },
  itemDescriptionContainer: {width: '100%', alignItems: 'center'},
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
