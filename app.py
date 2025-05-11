from flask import Flask, request, jsonify, send_from_directory
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

app = Flask(__name__, static_folder='.')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration (update with your email settings)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USER = os.environ.get('EMAIL_USER', 'your-email@gmail.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')  # Set as env variable in Render
EMAIL_RECIPIENT = os.environ.get('EMAIL_RECIPIENT', 'your-email@gmail.com')

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    else:
        # Default to index.html for SPA-like behavior
        return send_from_directory('.', 'index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')
        
        # Log the submission (helpful for debugging)
        logger.info(f"Contact form submission: {name} ({email})")
        
        # Simple validation
        if not all([name, email, message]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Prepare email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_RECIPIENT
        msg['Subject'] = f"Website Contact: {subject or 'New message from JackWebsites'}"
        
        email_body = f"""
        New contact form submission from JackWebsites:
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        """
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        if EMAIL_PASSWORD:  # Only attempt to send email if password is configured
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
                logger.info(f"Email sent successfully to {EMAIL_RECIPIENT}")
            return jsonify({'success': True, 'message': 'Message sent successfully!'}), 200
        else:
            # If email not configured, log the message but return success
            # This is useful during development or if you want to collect messages without email
            logger.warning("Email not sent - EMAIL_PASSWORD not configured")
            return jsonify({'success': True, 'message': 'Message received (email delivery not configured)'}), 200
            
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter():
    try:
        data = request.json
        email = data.get('email', '')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        
        # Log subscription (you can implement actual newsletter signup later)
        logger.info(f"Newsletter subscription: {email}")
        
        # Here you would typically add the email to a newsletter service
        # For now, we'll just return success
        return jsonify({'success': True, 'message': 'Subscription successful!'}), 200
    
    except Exception as e:
        logger.error(f"Error processing newsletter subscription: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or use 10000 as default
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
