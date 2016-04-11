'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bNavList from '../b-nav-list/b-nav-list';
import * as tpls from './b-tabs.ss';
import { block, model } from '../../core/block';

@model({}, tpls)
@block
export default class bTabs extends bNavList {}
