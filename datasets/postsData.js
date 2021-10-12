import { users } from './usersData';

export const posts = [
  {
    id: 'post-00001',
    imageUrl:
      'https://images.unsplash.com/photo-1503457574462-bd27054394c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80',
    user: users[0].id,
    username: users[0].name,
    likes: 64,
    caption: 'At the top of the mountain',
    profileUrl: users[0].image,
    comments: [
      {
        id: 'cmt-00001',
        user: users[1].id,
        username: 'hudabeauty',
        comment: 'Mind blowing photo',
      },
      {
        id: 'cmt-00002',
        user: users[2].id,
        username: 'lelepons',
        comment: 'Wow! Which mountain is this?',
      },
    ],
  },
  {
    id: 'post-00002',
    imageUrl:
      'https://images.unsplash.com/photo-1520437358207-323b43b50729?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    user: users[1].id,
    username: users[1].name,
    likes: 46,
    caption: 'Almost got hit by that plane while taking this',
    profileUrl: users[1].image,
    comments: [
      {
        id: 'cmt-00003',
        user: users[3].id,
        username: 'nusr_et',
        comment: 'This is insane!',
      },
      {
        id: 'cmt-00004',
        user: users[4].id,
        username: 'danbilzerian',
        comment: 'Worth the risk',
      },
    ],
  },
];
