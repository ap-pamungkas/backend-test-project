import { request } from './helpers/request.js'; 
import { connectDB, disconnectDB, getDB } from '../src/config/db.js'; 

let userCookie;
const authData = { name: 'Product Tester', email: 'prod@mail.com', password: '1234' };
const productPayload = { name: 'Keyboard', price: 99.9, description: 'Mechanical' };
let productId; 

beforeAll(async () => {
 
    await connectDB(); 
    const db = getDB();
    
  //  clean up database before each test
    await db.collection('users').deleteMany({ email: authData.email });
    await db.collection('products').deleteMany({ name: productPayload.name });
    
  //  register & login
    await request.post('/api/auth/register').send(authData);

    const loginRes = await request.post('/api/auth/login').send({
        email: authData.email,
        password: authData.password
    });
    
  //  catch cookie header and save it to userCookie
    const cookieHeader = loginRes.headers['set-cookie'];
    if (cookieHeader) {
        // search for token cookie and save it to userCookie
        userCookie = cookieHeader.find(c => c.startsWith('token=')).split(';')[0];
    } else {
        throw new Error("Failed to retrieve authentication cookie.");
    }
});

afterAll(async () => {
    // clean up database after each test
    const db = getDB();
    await db.collection('users').deleteMany({ email: authData.email });
    await db.collection('products').deleteMany({ name: productPayload.name });
    
    await disconnectDB(); 
});


describe('CRUD /api/products', () => {
    
    it('should block unauthenticated create (401)', async () => {
        const res = await request.post('/api/products').send(productPayload);
        expect(res.statusCode).toBe(401);
    });
    
    it('should create product (201)', async () => {
        const res = await request.post('/api/products')
            .set('Cookie', userCookie)
            .send(productPayload);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Keyboard');
        expect(res.body).toHaveProperty('_id');
        productId = res.body._id; 
    });

    it('should list only authenticated user products (200)', async () => {
        const res = await request.get('/api/products')
            .set('Cookie', userCookie); 

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1); 
        expect(res.body[0]._id).toBe(productId);
    });

    it('should update product (200)', async () => {
        const updatePayload = { price: 79.9 };
        const res = await request.patch(`/api/products/${productId}`)
            .set('Cookie', userCookie)
            .send(updatePayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/updated/i);
    });

    it('should delete product (200)', async () => {
        const res = await request.delete(`/api/products/${productId}`)
            .set('Cookie', userCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });

    it('should block unauthenticated list access (401)', async () => {
        const res = await request.get('/api/products');
        expect(res.statusCode).toBe(401); 
    });
});