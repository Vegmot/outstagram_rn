import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase, db } from '../../firebase';

const Post = ({ post }) => {
  const handleLike = post => {
    const currentLikeStatus = !post.likesByUsers.includes(
      firebase.auth().currentUser.email
    );

    db.collection('users')
      .doc(post.ownerEmail)
      .collection('posts')
      .doc(post.id)
      .update({
        likesByUsers: currentLikeStatus
          ? firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          : firebase.firestore.FieldValue.arrayRemove(
              firebase.auth().currentUser.email
            ),
      })
      .then(() => {
        console.log('Document updated');
      })
      .catch(err => {
        console.log('Error when updating document:', err);
      });
  };

  return (
    <View style={{ marginBottom: 30 }}>
      <Divider width={1} orientation='vertical' />
      <PostHeader post={post} />
      <PostImage post={post} />
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <PostFooter post={post} handleLike={handleLike} />
        <Likes post={post} />
        <Caption post={post} />
        <CommentsSection post={post} />
        <Comments post={post} />
      </View>
    </View>
  );
};

const PostHeader = ({ post }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 5,
      marginRight: 5,
      alignItems: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={{ uri: post.profileUrl }} style={styles.postImage} />
      <Text style={{ color: 'white', marginLeft: 5, fontWeight: '700' }}>
        {post.username}
      </Text>
    </View>

    <Text style={{ color: 'white', fontWeight: '900' }}>...</Text>
  </View>
);

const PostImage = ({ post }) => (
  <View style={{ width: '100%', height: 450 }}>
    <Image
      source={{ uri: post.imageUrl }}
      style={{ height: '100%', resizeMode: 'cover' }}
    />
  </View>
);

const PostFooter = ({ handleLike, post }) => (
  <View style={{ flexDirection: 'row' }}>
    <View style={styles.leftFooterIconsContainer}>
      <TouchableOpacity onPress={() => handleLike(post)}>
        {post.likesByUsers.includes(firebase.auth().currentUser.email) ? (
          <Icon name='heart' size={30} color='red' />
        ) : (
          <Icon name='heart-o' size={30} color='#fff' />
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name='comment-o' size={30} color='#fff' />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name='send-o' size={30} color='#fff' />
      </TouchableOpacity>
    </View>

    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <TouchableOpacity>
        <Icon name='bookmark-o' size={30} color='#fff' />
      </TouchableOpacity>
    </View>
  </View>
);

const Likes = ({ post }) => (
  <View style={{ flexDirection: 'row', marginTop: 5 }}>
    <Text style={{ color: 'white', fontWeight: '600' }}>
      {post.likesByUsers.length.toLocaleString('en')} likes
    </Text>
  </View>
);

const Caption = ({ post }) => (
  <View style={{ marginTop: 5 }}>
    <Text style={{ color: 'white' }}>
      <Text style={{ fontWeight: '600' }}>{post.username}</Text>
      <Text> {post.caption}</Text>
    </Text>
  </View>
);

const CommentsSection = ({ post }) => {
  const numComments = post.comments.length;

  return (
    <View style={{ marginTop: 5 }}>
      {numComments > 0 && (
        <Text style={{ color: 'gray' }}>
          View{numComments > 1 ? ' all' : ''} {numComments}{' '}
          {numComments > 1 ? 'comments' : 'comment'}
        </Text>
      )}
    </View>
  );
};

const Comments = ({ post }) => (
  <>
    {post.comments.map(comment => (
      <View key={comment.id} style={{ flexDirection: 'row', marginTop: 5 }}>
        <Text style={{ color: 'white' }}>
          <Text style={{ fontWeight: '600' }}>{comment.username}</Text>{' '}
          {comment.comment}
        </Text>
      </View>
    ))}
  </>
);

export default Post;

const styles = StyleSheet.create({
  postImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },
  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '32%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
