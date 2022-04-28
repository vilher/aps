# mysql-aes-binary

- This module is based on the popular module mysql-aes. 

- mysql-aes, however, transforms values to 'hex' after encryption. This results in at least 'doubling' the data size depending on the encoding you use. To directly quote from mysql documentation: "The size penalty for storing the hex string in a CHAR column is at least two times, up to eight times if the value is stored in a column that uses the utf8 character set (where each character uses 4 bytes). Storing the string also results in slower comparisons because of the larger values and the need to take character set collation rules into account."

- You can check the mysql documentation for details: https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html

- Our module is similar to mysql-aes, however, we keep the encrypted data as binary. Thus, we save you at least half (50%) your database size.

- This is a Node.js implementation of MySQL `aes_encrypt` and `aes_decrypt`

- Lastly, do not forget to make your column types as 'varbinary' in mysql...

## Install
```sh
$ npm i mysql-aes-binary --save
```

## API
```js
const AES = require('mysql-aes-binary')
```

|return type|signature|equal in mysql|
|---|---|---|
| `String` | `AES.encrypt(str, key)`        | `SELECT AES_ENCRYPT(str, key)` |
| `String` | `AES.decrypt(encrypted, key)`  | `SELECT CAST(AES_DECRYPT(encrypted, key) as CHAR)`


## License
the MIT License http://magicdawn.mit-license.org