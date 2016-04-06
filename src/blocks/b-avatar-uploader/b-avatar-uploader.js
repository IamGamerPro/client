'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bWindow from '../b-window/b-window';
import * as tpls from './b-avatar-uploader.ss';
import { block, model } from '../../core/block';

@model({}, tpls)
@block
export default class bAvatarUploader extends bWindow {}
