'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bButton from '../b-button/b-button';
import * as tpls from './b-uploader.ss';
import { block, model } from '../../core/block';

@model({}, tpls)
@block
export default class bUploader extends bButton {}
