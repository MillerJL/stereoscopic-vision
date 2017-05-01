import React from 'react'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Upload from './containers/Upload'
import Edit from './containers/Edit'
import App from './containers/App'
import Process from './containers/Process'
import Review from './containers/Review'
import * as reducers from './reducers'

import 'material-design-lite/src/typography/_typography.scss'

injectTapEventPlugin()

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') middleware.push(createLogger())
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})
const store = createStore(reducer, applyMiddleware(...middleware))
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute components={{ content: Upload }} />
        <Route path='edit' components={{ content: Edit }} />
        <Route path='process' components={{ content: Process }} />
        <Route path='review' components={{ content: Review }} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
