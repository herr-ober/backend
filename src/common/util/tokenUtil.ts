import * as jose from 'jose'

export async function generateToken(payload: jose.JWTPayload): Promise<string> {
  // TODO: This private key is for testing purpose only! Do not use in production
  const algorithm = 'ES256'
  const pkcs8 = `-----BEGIN PRIVATE KEY-----
  MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
  nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
  l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
  -----END PRIVATE KEY-----`
  const privateKey: jose.KeyLike = await jose.importPKCS8(pkcs8, algorithm)

  return new jose.SignJWT(payload).setProtectedHeader({ alg: 'ES256' }).sign(privateKey)
}

export async function verifyToken(token: string): Promise<jose.JWTPayload> {
  // TODO: This public key is for testing purpose only! Do not use in production
  const algorithm = 'ES256'
  const spki = `-----BEGIN PUBLIC KEY-----
  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
  YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
  -----END PUBLIC KEY-----`
  const publicKey: jose.KeyLike = await jose.importSPKI(spki, algorithm)

  const result: jose.JWTVerifyResult = await jose.jwtVerify(token, publicKey)
  return result.payload
}
