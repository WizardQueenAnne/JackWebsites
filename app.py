from flask import Flask, request, jsonify, send_from_directory
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='.')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration (update with your email settings)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USER = os.environ.get('EMAIL_USER', 'jacksseattlewebsites@gmail.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')  # Set as env variable in production
EMAIL_RECIPIENT = os.environ.get('EMAIL_RECIPIENT', 'jacksseattlewebsites@gmail.com')

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
        business_name = data.get('businessName', '')
        email = data.get('email', '')
        phone = data.get('phone', 'Not provided')
        website_plan = data.get('websitePlan', '')
        rush_delivery = data.get('rushDelivery', 'No')
        budget = data.get('budget', 'Not specified')
        message = data.get('message', '')
        
        # Log the submission (helpful for debugging)
        logger.info(f"Contact form submission: {name} ({business_name})")
        
        # Simple validation
        if not all([name, email, business_name]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Prepare email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_RECIPIENT
        msg['Subject'] = f"Website Inquiry: {website_plan} Package from {business_name}"
        
        email_body = f"""
        New website inquiry from Jack's Seattle Websites:
        
        Name: {name}
        Business Name: {business_name}
        Email: {email}
        Phone: {phone}
        
        Website Plan: {website_plan}
        24-Hour Rush Delivery: {rush_delivery}
        Budget/Offer: {budget}
        
        Notes/Requests:
        {message}
        
        Received: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        if EMAIL_PASSWORD:  # Only attempt to send email if password is configured
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
                logger.info(f"Email sent successfully to {EMAIL_RECIPIENT}")
            return jsonify({'success': True, 'message': 'Thanks! I\'ll get back to you shortly.'}), 200
        else:
            # If email not configured, log the message but return success
            # This is useful during development or if you want to collect messages without email
            logger.warning("Email not sent - EMAIL_PASSWORD not configured")
            return jsonify({'success': True, 'message': 'Thanks! I\'ll get back to you shortly.'}), 200
            
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/chat-message', methods=['POST'])
def chat_message():
    try:
        data = request.json
        user_message = data.get('message', '')
        user_name = data.get('name', 'Website Visitor')
        
        if not user_message:
            return jsonify({'success': False, 'error': 'No message provided'}), 400
        
        # Log the chat message
        logger.info(f"Chat message received: {user_message}")
        
        # Prepare email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_RECIPIENT
        msg['Subject'] = f"New Chat Message from {user_name}"
        
        email_body = f"""
        New chat message from your website:
        
        From: {user_name}
        Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        
        Message:
        {user_message}
        """
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        if EMAIL_PASSWORD:  # Only attempt to send email if password is configured
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
                logger.info(f"Chat message email sent successfully to {EMAIL_RECIPIENT}")
                
        # Return a default bot response
        bot_response = None
        
        # Simple bot responses based on keywords
        if "pricing" in user_message.lower() or "cost" in user_message.lower() or "price" in user_message.lower():
            bot_response = "My packages start at $75 for a basic website. Check out the pricing section for more details, or let me know your specific needs for a custom quote!"
        elif "time" in user_message.lower() or "how long" in user_message.lower() or "deadline" in user_message.lower():
            bot_response = "Most projects are completed within 1-3 days, and I offer a 24-hour rush delivery option for an additional 25% of the package price!"
        elif "contact" in user_message.lower() or "email" in user_message.lower() or "phone" in user_message.lower():
            bot_response = "You can reach me at jacksseattlewebsites@gmail.com or call/text me at (206) 555-1234. I'm usually available quickly to answer questions!"
        else:
            bot_response = "Thanks for your message! I'll get back to you shortly. In the meantime, feel free to check out my portfolio or pricing packages."
            
        return jsonify({
            'success': True, 
            'response': bot_response
        }), 200
            
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter():
    try:
        data = request.json
        email = data.get('email', '')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        
        # Log subscription
        logger.info(f"Newsletter subscription: {email}")
        
        # Prepare email notification
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_RECIPIENT
        msg['Subject'] = "New Newsletter Subscription"
        
        email_body = f"""
        Someone has subscribed to your newsletter:
        
        Email: {email}
        Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        if EMAIL_PASSWORD:  # Only attempt to send email if password is configured
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
                logger.info(f"Newsletter subscription email sent successfully to {EMAIL_RECIPIENT}")
        
        # Here you would typically add the email to a newsletter service
        # For now, we'll just return success
        return jsonify({'success': True, 'message': 'Subscription successful!'}), 200
    
    except Exception as e:
        logger.error(f"Error processing newsletter subscription: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=(os.environ.get('FLASK_ENV') == 'development'))
