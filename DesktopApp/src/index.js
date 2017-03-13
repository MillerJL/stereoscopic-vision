import React from 'react'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Home from './containers/Home'
import Upload from './containers/Upload'
import Edit from './containers/Edit'
import App from './containers/App'
import * as reducers from './reducers'
injectTapEventPlugin()

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') middleware.push(createLogger())
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})
const store = createStore(reducer, applyMiddleware(...middleware))
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute components={{ content: Home }} />
        <Route path='upload' components={{ content: Upload }} />
        <Route path='edit' components={{ content: Edit }} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
