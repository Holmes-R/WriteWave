import upload from "../middleware/multer";

const router = express.Router();

router.post('/register',upload.single('avatar'), register);
router.get('/profile/:username', getProfile);
router.post('login', login);    