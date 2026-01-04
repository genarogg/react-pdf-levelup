import { registerGraphQL as graphql } from './graphql';

import viewEJS from './viewEJS';
import staticFiles from './staticFiles';
import caching from './caching';
import rateLimit from './rateLimit';
import helmet from './helmet';
import corsFastify from './corsFastify';
import underPressureFastify from './underPressureFastify';
import slowDownFastify from './slowDownFastify';
import compressFastify from './compressFastify';
import multipart from './multipar';
import dbConection from './db-conection';
import proxy from './proxy';

export {
    staticFiles,
    viewEJS,
    graphql,
    caching,
    rateLimit,
    helmet,
    corsFastify,
    underPressureFastify,
    slowDownFastify,
    compressFastify,
    proxy,
    multipart,
    dbConection,
}