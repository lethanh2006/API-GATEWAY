"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const metadata_keys_1 = require("../constants/metadata-keys");
const Roles = (...roles) => (0, common_1.SetMetadata)(metadata_keys_1.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=role.decorator.js.map