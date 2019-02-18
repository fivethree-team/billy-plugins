#!/usr/bin/env node
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20; //TODO FIXME (multiple exit listeners, not getting removed  - inquirer)
require('../billy');
