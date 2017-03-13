import React from 'react'
import { GridList, GridTile } from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward'

let defaultImg = require('../public/gridlistpics/default-thumbnail.jpg')

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridList: {
    display: 'flex',
    flexBasis: '100%',
    flexGrow: 1,
    margin: '10px'
  }
}

const tilesData = [
  {
    directory: 'Directory 1',
    videos: [
      {
        img: require('../public/gridlistpics/00-52-29-429_640.jpg'),
        title: 'Breakfast',
        author: 'January 1, 2016'
      }
    ]
  },
  {
    directory: 'Grand Canyon',
    videos: [
      {
        img: require('../public/gridlistpics/00-52-29-429_640.jpg'),
        title: 'Breakfast',
        author: 'July 2, 2016'
      },
      {
        img: require('../public/gridlistpics/burger-827309_640.jpg'),
        title: 'Tasty burger',
        author: 'July 2, 2016'
      }
    ]
  },
  {
    directory: 'Vacation Summer 2016',
    videos: [
      {
        img: require('../public/gridlistpics/hats-829509_640.jpg'),
        title: 'Hats',
        author: 'August 3, 2016'
      },
      {
        img: require('../public/gridlistpics/honey-823614_640.jpg'),
        title: 'Honey',
        author: 'September 12, 2016'
      },
      {
        img: require('../public/gridlistpics/vegetables-790022_640.jpg'),
        title: 'Vegetables',
        author: 'September 13, 2016'
      },
      {
        img: require('../public/gridlistpics/water-plant-821293_640.jpg'),
        title: 'Water plant',
        author: 'September 18, 2016'
      }
    ]
  }
]

const Home = () => (
  <div style={styles.root} className='ayy lmao'>
    {tilesData.map((directory) => (
      <GridList
        key={directory.directory}
        cellHeight={180}
        style={styles.gridList}
        cols={(directory.videos.length < 4 ? directory.videos.length : 4)}
      >
        <Subheader>{directory.directory}</Subheader>
        {directory.videos.slice(0, 4).map((video, vidIndex) => {
          if (vidIndex < 3) {
            return (<GridTile
              key={directory.directory + '_' + vidIndex.toString()}
              title={video.title}
              subtitle={<span>by <b>{video.author}</b></span>}
              actionIcon={<IconButton><NavigationMenu color='white' /></IconButton>}
            >
              <img src={video.img} alt='ayy lmao' />
            </GridTile>)
          } else {
            return (<GridTile
              key={directory.directory + '_' + vidIndex.toString()}
              title={'And ' + (directory.videos.length - 3).toString() + ' more videos'}
              actionIcon={<IconButton><ArrowForward color='white' /></IconButton>}
            >
              <img src={defaultImg} alt='ayy lmao' />
            </GridTile>)
          }
        })}
      </GridList>
    ))}
  </div>
)

export default Home
