// 1. Create controller functions
// blog_index_get, blog_id_get, blog_create_post, blog_delete
// 2. Export these functions
// 3. Import these functions in the routes file
const BlogPost = require('../models/blogpost');


// blog_index_get
const blog_index_get = (req, res) => {
    const userIdFromToken = res.locals.user.id;
    BlogPost.find({author: userIdFromToken}).sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs/blogs', { title: 'All blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('blogs/fail');
        });
}


// blog_id_get
const blog_id_get = (req, res) => {
    BlogPost.findById(req.params.id)
        .populate('author')
        .then((blog) => {
            console.log("Getting blog by ID");
            console.log(blog);
            res.render('blogs/single-blog', { title: blog.title, blog });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('error', { title: 'Blog Not Found' });
        });
}

// blog_create_post
const blog_create_post = (req, res) => {
    // get the user reference from logged in user, via res.locals.user
    const userIdFromToken = res.locals.user.id;
    // Create a new blog post using the BlogPost static method
    const blog = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        author: userIdFromToken
    }
    
    BlogPost.create(blog)
        .then((result) => {
            console.log(`New blog added: ${result.title}`);
            res.redirect('/blogs/success');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/blogs/fail');
        });





    // Another approach to create a new blog post
    // const blogpost = new BlogPost(blog);
    // blogpost.save()
    //     .then((result) => {
    //         console.log(`New blog added: ${result.title}`);
    //         res.redirect('blogs/success');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.redirect('/blogs/fail');
    //     });
    console.log(`New blog added: ${blog.title}`);
}


// blog_delete
const blog_delete = (req, res) => {
    console.log(`Deleting blog with id: ${req.params.id}`);
    BlogPost.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(`Blog deleted: ${result.title}`);
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/blogs/fail');
        });
}


module.exports = {
    blog_index_get,
    blog_id_get,
    blog_create_post,
    blog_delete
}
