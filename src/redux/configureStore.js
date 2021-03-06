import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducers';

export default function configureStore(history, initialState) {
    const middleware = [thunk];

    const reduxRouterMiddleware = routerMiddleware(history);
    middleware.push(reduxRouterMiddleware);

    let enhancer;

    if (__DEV__ && process.env.BROWSER) {
        const createLogger = require('redux-logger');
        const logger = createLogger({
            collapsed: true,
        });
        middleware.push(logger);

        enhancer = compose(
            applyMiddleware(...middleware),

            // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
            window.devToolsExtension ? window.devToolsExtension() : f => f,
        );
    } else {
        enhancer = applyMiddleware(...middleware);
    }
    // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
    // See https://github.com/rackt/redux/releases/tag/v3.1.0
    const store = createStore(rootReducer, initialState, enhancer);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (__DEV__ && module.hot) {
        module.hot.accept('./reducers', () =>
            store.replaceReducer(require('./reducers').default)
        );
    }

    return store;
}
